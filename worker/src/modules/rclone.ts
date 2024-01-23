import ini from 'ini';
import { logWithTimestamp, errorWithTimestamp } from './log.js';
import fs from 'fs';
import { executeBashCommand } from './bash.js';
import { clearInterval, setInterval } from 'timers';
import readLastLines from 'read-last-lines';
import path from 'path';
import { checkIfArchiveIsReachable } from './network.js';
import { mountTeslaCamAsReadOnly, unmountTeslaCam } from './storage.js';

// TODO: remove dependencies and move to rclone.ts
export const processRcloneCopy = async (paths: { source: string, destination: string }[], delayBetweenCopyRetryInSeconds: number, rcloneConfigPath: string) => {
    logWithTimestamp("Processing rclone copy");

    // TODO: add a health check that checks - if on wifi, but no wifi clients, and cannot connect to source, or copy job has been running for 2+ hrs (once refactored to run 1 rclone job per folder), then reboot

    if (getRcloneConfig() === false) {
        errorWithTimestamp(`rclone config file not found at '/root/.config/rclone/rclone.conf', run 'rclone config' to set up.`);
        return;
    }

    logWithTimestamp("Starting copy");
    try {
        await mountTeslaCamAsReadOnly();
    } catch (error) {
        errorWithTimestamp("Error mounting TeslaCam:", error);
    }
    try {
        for (const path of paths) {
            await rcloneCopyWithProgress(path.source, rcloneConfigPath, path.destination);
        }
    } catch (error) {
        errorWithTimestamp("Error copying TeslaCam:", error);
    }
    try {
        await unmountTeslaCam();
    } catch (error) {
        errorWithTimestamp("Error unmounting TeslaCam:", error);
    }
    logWithTimestamp(`Executed copy, will not attempt for another ${delayBetweenCopyRetryInSeconds} seconds`);
}

export const rcloneCopyWithProgressOld = async (path: string, rcloneConfig: string, destinationPath: string) => {
    const intervalId = setInterval(() => {
        logWithTimestamp("Copying files, check rclone.log for status...");
        // Add something useful here, e.g. giving percentage complete, transfer speed, time remaining
    }, 60000); // 60000 ms = 1 minute

    try {
        await rcloneCopy(path, rcloneConfig, destinationPath);
    } finally {
        clearInterval(intervalId);
    }
};


// TODO: Move over to this new function (not tested yet)
export const rcloneCopyWithProgress = async (basePath: string, rcloneConfig: string, destinationPath: string) => {
    // Function to list subfolders
    const listSubfolders = async (dir: string): Promise<string[]> => {
        const subdirs = await fs.promises.readdir(dir);
        const folders = await Promise.all(subdirs.map(async (subdir) => {
            const res = path.resolve(dir, subdir);
            return (await fs.promises.stat(res)).isDirectory() ? res : '';
        }));
        return folders.filter(Boolean);
    };

    // Function to get folder information (number of files and total size)
    const getFolderInfo = async (folderPath: string): Promise<{ fileCount: number, totalSize: number }> => {
        const files = await fs.promises.readdir(folderPath);
        let totalSize = 0;
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const stat = await fs.promises.stat(filePath);
            if (stat.isFile()) totalSize += stat.size;
        }
        return { fileCount: files.length, totalSize };
    };

    // List and sort subfolders
    const folders = await listSubfolders(basePath);
    folders.sort().reverse();

    for (const folder of folders) {
        // Get folder information
        const { fileCount, totalSize } = await getFolderInfo(folder);

        // Log event
        logWithTimestamp(`Copying folder: "${folder}" to "${destinationPath}", Files: ${fileCount}, Total Size: ${Math.round(totalSize / 1024 / 1024)} MB`);

        const intervalId = setInterval(() => {
            logWithTimestamp(`Still copying folder: ${folder}.  Check rclone.log for status...`);
            // Add something useful here, e.g. giving percentage complete, transfer speed, time remaining
        }, 60000); // 60000 ms = 1 minute

        try {
            // await rcloneCopy(folder, rcloneConfig, path.join(destinationPath, path.basename(folder)));

            const lastElement = path.basename(folder);
            const resultPath = path.join(destinationPath, lastElement);

            await rcloneCopy(folder, rcloneConfig, resultPath);
        } finally {
            clearInterval(intervalId);
        }

    }
};



export const getRcloneConfig = () => {
    const configPath = '/root/.config/rclone/rclone.conf';
    if (fs.existsSync(configPath) === false) {
        return { host: false };
    }
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config = ini.parse(configContent);

    return config['node-teslausb'];
}

export const rcloneCopy = async (sourcePath: string, rcloneConfig: string, destinationPath: string) => {
    if (fs.existsSync(sourcePath) === false) {
        logWithTimestamp(`Skipping rclone copy for ${sourcePath} (does not exist)`)
        return
    }
    logWithTimestamp(`Starting rclone copy for ${sourcePath}`)
    await executeBashCommand(`rclone copy ${sourcePath} ${rcloneConfig}:${destinationPath} -v --transfers=1 --checkers=1 --use-json-log 2>&1 | tee -a /logs/rclone.log`, false)

}

export const getLastLineAsObject = async (filePath: string) => {
    try {
        const lastLine = await readLastLines.read(filePath, 1);
        return JSON.parse(lastLine);
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};