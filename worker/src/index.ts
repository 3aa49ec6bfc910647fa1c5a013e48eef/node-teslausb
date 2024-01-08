// import { createDb, addItem, getItem, updateItem, queryItem } from './modules/db.js';

import { getRcloneConfig, rcloneCopyWithProgress } from './modules/rclone.js';
import { logWithTimestamp, errorWithTimestamp } from './modules/log.js';
import { restartWifi, checkIfArchiveIsReachable } from './modules/network.js';
import { mountTeslaCamAsReadOnly, unmountTeslaCam } from './modules/storage.js';
import { checkLockChime } from './modules/lockChimes.js';
import { readConfigFile } from './modules/config.js';
import { checkAndInstallUpdate, installUpdate } from './modules/update.js';

const configFilePath = '/config/node-teslausb.json';
const config = await readConfigFile(configFilePath);

interface WorkerState {
    errorCount: number;
    lastCopyDate: Date | undefined;
    lastUpdateCheckedDate: Date | undefined;
}

const state: WorkerState = {
    errorCount: 0,
    lastCopyDate: undefined,
    lastUpdateCheckedDate: undefined,
}

logWithTimestamp("Starting");

// TODO: remove dependencies and move to rclone.ts
const processRcloneCopy = async () => {
    logWithTimestamp("Processing rclone copy");

    // TODO: add a health check that checks - if on wifi, but no wifi clients, and cannot connect to source, or copy job has been running for 2+ hrs (once refactored to run 1 rclone job per folder), then reboot

    await checkLockChime();

    if (getRcloneConfig() === false) {
        errorWithTimestamp(`rclone config file not found at '/root/.config/rclone/rclone.conf', run 'rclone config' to set up.`);
        return;
    }

    const archiveReachable = await checkIfArchiveIsReachable(); // this is redundant, clean up later
    if (archiveReachable === false) {
        // removing this functionality due to hotspot mode, do a cleanup later
        // await restartWifi();
    } else if (state.lastCopyDate === undefined || ((new Date()).getTime() > (new Date(state.lastCopyDate)).getTime() + config.delayBetweenCopyRetryInSeconds * 1000)) {
        logWithTimestamp("Connected to archive server, starting copy");
        try {
            await mountTeslaCamAsReadOnly();
        } catch (error) {
            errorWithTimestamp("Error mounting TeslaCam:", error);
        }
        try {
            const paths = [
                config.paths.sentryClips,
                config.paths.savedClips,
            ];
            for (const path of paths) {
                await rcloneCopyWithProgress(path, config.archive.rcloneConfig, config.archive.destinationPath);
            }
        } catch (error) {
            errorWithTimestamp("Error copying TeslaCam:", error);
        }
        try {
            await unmountTeslaCam();
        } catch (error) {
            errorWithTimestamp("Error unmounting TeslaCam:", error);
        }
        logWithTimestamp(`Executed copy, will not attempt for another ${config.delayBetweenCopyRetryInSeconds} seconds`);
        state.lastCopyDate = new Date();
    }
}

let isRunning = false;

const main = async () => {
    if (isRunning) {
        return;
    }

    isRunning = true;

    try {
        const archiveReachable = await checkIfArchiveIsReachable();
        let promises: Promise<any>[] = []
        if (archiveReachable === true) {
            promises.push(processRcloneCopy())
            // const rcloneCopyPromise = processRcloneCopy();
            // promises.push(rcloneCopyPromise);
            if (config.autoUpdate.enabled && (state.lastUpdateCheckedDate === undefined || ((new Date()).getTime() > (new Date(state.lastUpdateCheckedDate)).getTime() + config.autoUpdate.checkInterval * 1000))) {
                // const updateCheckPromise = checkAndInstallUpdate();
                promises.push(checkAndInstallUpdate());
                state.lastUpdateCheckedDate = new Date();
            }
        } else {
            // do wifi hotspot stuff here
        }
        await Promise.all(promises);

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