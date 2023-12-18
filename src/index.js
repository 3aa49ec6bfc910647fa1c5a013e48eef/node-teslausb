// import { createDb, addItem, getItem, updateItem, queryItem } from './modules/db.js';

import util from 'util';
import { exec } from 'child_process';
// import { promises as fspromises } from 'fs';
import ping from 'ping';
import path from 'path';
import ini from 'ini';
import fs from 'fs';

const getRcloneConfig = () => {
    const configPath = '/root/.config/rclone/rclone.conf';
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config = ini.parse(configContent);

    return config['node-teslausb'];
}

const config = {
    archive: {
        server: (getRcloneConfig()).host,
        rcloneConfig: "node-teslausb",
        destinationPath: "teslausb/TeslaCam"
    },
    delayBetweenCopyRetryInSeconds: 3600,
}

const state = {
    errorCount: 0,
    lastCopyDate: undefined
};

const getTimestamp = () => {
    return new Date().toISOString();
};

const logWithTimestamp = (...args) => {
    console.log(getTimestamp(), ...args);
};

const errorWithTimestamp = (...args) => {
    console.error(getTimestamp(), ...args);
};

logWithTimestamp("Starting");

const processInterval = async () => {
    logWithTimestamp("Processing");

    // TODO: add a health check that checks - if on wifi, but no wifi clients, and cannot connect to source, or copy job has been running for 2+ hrs (once refactored to run 1 rclone job per folder), then reboot

    const archiveReachable = await checkIfArchiveIsReachable(config.archive.server);
    if (archiveReachable === false) {
        await restartWifi();
    } else if (state.lastCopyDate === undefined || (Date.now() > state.lastCopyDate + config.delayBetweenCopyRetryInSeconds * 1000)) {
        logWithTimestamp("Connected to archive server, starting copy");
        try {
            await mountTeslaCamAsReadOnly();
        } catch (error) {
            errorWithTimestamp("Error mounting TeslaCam:", error);
        }
        try {
            await rcloneCopy();
        } catch (error) {
            errorWithTimestamp("Error copying TeslaCam:", error);
        }
        try {
            await unmountTeslaCam();
        } catch (error) {
            errorWithTimestamp("Error unmounting TeslaCam:", error);
        }
        state.lastCopyDate = Date.now();
    }
}

const restartWifi = async () => {
    logWithTimestamp("Restarting wifi")
    await executeBashCommand("ifconfig wlan0 down && ifconfig wlan0 up")
}

const mountTeslaCamAsReadOnly = async () => {
    logWithTimestamp("Mounting TeslaCam")
    await executeBashCommand("sudo mount -o ro /vusb/TeslaCam /mnt/TeslaCam && systemctl daemon-reload")
}

const unmountTeslaCam = async () => {
    logWithTimestamp("Unmounting TeslaCam")
    await executeBashCommand("sudo umount /mnt/TeslaCam && systemctl daemon-reload")
}

const rcloneCopy = async () => {
    logWithTimestamp("Starting rclone copy")
    await executeBashCommand(`rclone copy /mnt/TeslaCam/TeslaCam/SentryClips ${config.archive.rcloneConfig}:${config.archive.destinationPath}/SentryClips -vv --transfers=1 2>&1 | tee -a /logs/rclone.log`)
    await executeBashCommand(`rclone copy /mnt/TeslaCam/TeslaCam/SavedClips ${config.archive.rcloneConfig}:${config.archive.destinationPath}/SavedClips -vv --transfers=1 2>&1 | tee -a /logs/rclone.log`)
}

// TODO: Fix stdout / stderr output in log files
const executeBashCommand = async (command) => {
    try {
        const { stdout, stderr } = await util.promisify(exec)(command);
        console.log(`stdout: ${stdout}`);

        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }

        return stdout;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw error;
    }
};

// Not in use - leaving for now as it may be useful later
// async function listFolderContents(folderPath, recursive = false) {
//     let entries = [];
//     try {
//         entries = await fspromises.readdir(folderPath, { withFileTypes: true });
//     } catch (error) {
//         return [];
//     }
//     let files = [];

//     for (const entry of entries) {
//         const entryPath = path.join(folderPath, entry.name);

//         if (entry.isDirectory()) {
//             if (recursive) {
//                 const subdirectoryFiles = await listFolderContents(entryPath, true);
//                 files = files.concat(subdirectoryFiles);
//             } else {
//                 files.push({ path: entryPath, type: 'directory' });
//             }
//         } else {
//             files.push({ path: entryPath, type: 'file' });
//         }
//     }

//     return files;
// }

const checkIfArchiveIsReachable = async (archiveServer) => {

    try {
        const res = await ping.promise.probe(archiveServer, {
            timeout: 5,  // Timeout in seconds
            extra: ["-c", "1"],  // Sends only 1 packet
        });

        logWithTimestamp(`${archiveServer} is ${res.alive ? 'reachable' : 'not reachable'}`);
        return res.alive;
    } catch (error) {
        errorWithTimestamp('Error pinging archive server:', error);
        return false;
    }
};

let isRunning = false;

const main = async () => {
    if (isRunning) {
        return;
    }

    isRunning = true;

    try {
        await processInterval();
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
        setTimeout(main, 120000);
    }
};

// Run immediately
await main();