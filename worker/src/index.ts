// import { createDb, addItem, getItem, updateItem, queryItem } from './modules/db.js';

import { getRcloneConfig, rcloneCopyWithProgress, processRcloneCopy } from './modules/rclone.js';
import { logWithTimestamp, errorWithTimestamp } from './modules/log.js';
import { restartWifi, checkIfArchiveIsReachable } from './modules/network.js';
import { mountTeslaCamAsReadOnly, unmountTeslaCam } from './modules/storage.js';
import { checkLockChime } from './modules/lockChimes.js';
import { readConfigFile } from './modules/config.js';
import { checkAndInstallUpdate, installUpdate } from './modules/update.js';
import { DatabaseManager } from './modules/db.js';

const configFilePath = '/etc/node-teslausb/node-teslausb.json';
const config = await readConfigFile(configFilePath);

interface WorkerState {
    errorCount: number;
    lastCopyDate: Date | undefined;
    lastUpdateCheckedDate: Date | undefined;
    isConnected: boolean;
}

const state: WorkerState = {
    errorCount: 0,
    lastCopyDate: undefined,
    lastUpdateCheckedDate: undefined,
    isConnected: false
}

logWithTimestamp("Starting worker...");

const db = new DatabaseManager(config.dbPath);
db.initializeDb();

let isRunning = false;

const main = async () => {
    if (isRunning) {
        return;
    }

    isRunning = true;

    try {
        const archiveReachable = await checkIfArchiveIsReachable();
        let promises: Promise<any>[] = []

        promises.push(checkLockChime())

        if (archiveReachable === true) {
            if (state.isConnected === false) {
                logWithTimestamp("Connected to archive server.");
            }
            state.isConnected = true;
            if (state.lastCopyDate === undefined || ((new Date()).getTime() > (new Date(state.lastCopyDate)).getTime() + config.delayBetweenCopyRetryInSeconds * 1000)) {
                promises.push(
                    // Make an interface for this
                    processRcloneCopy(
                        config.paths,
                        config.delayBetweenCopyRetryInSeconds,
                        config.archive.rcloneConfig,
                        db
                    )
                )
            }
            if (config?.autoUpdate !== undefined && config.autoUpdate.enabled && (state.lastUpdateCheckedDate === undefined || ((new Date()).getTime() > (new Date(state.lastUpdateCheckedDate)).getTime() + config.autoUpdate.checkInterval * 1000))) {
                // update default config to include autoUpdate
                promises.push(checkAndInstallUpdate());
            }
        } else {
            state.isConnected = false;
            // do wifi hotspot stuff here
        }

        await Promise.all(promises);

        if (archiveReachable == true) {
            state.lastCopyDate = new Date();
            state.lastUpdateCheckedDate = new Date();
        }

        if (state.errorCount > 0) {
            state.errorCount -= 1;
            logWithTimestamp("Error count reduced:", state.errorCount);
        }
    } catch (error) {
        state.errorCount += 1;
        errorWithTimestamp(error);
        logWithTimestamp("Error count increased:", state.errorCount);
        if (state.errorCount >= 10) {
            logWithTimestamp("Passed error threshold, terminating");
            throw "Terminating due to too many errors"
        }
    } finally {
        isRunning = false;
        // Wait 2 minutes before running again
        setTimeout(main, config.mainLoopIntervalInSeconds * 1000);
    }
};

// Run immediately
(async () => {
    await main();
})();