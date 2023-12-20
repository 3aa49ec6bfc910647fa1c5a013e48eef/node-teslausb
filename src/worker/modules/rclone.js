import ini from 'ini';
import { logWithTimestamp, errorWithTimestamp } from './log.js';
import fs from 'fs';
import { executeBashCommand } from './bash.js';

import { clearInterval, setInterval } from 'timers';

export const rcloneCopyWithProgress = async (path, rcloneConfig, destinationPath) => {
    const intervalId = setInterval(() => {
        logWithTimestamp("Copying files...");
        // Add something useful here, e.g. giving percentage complete, transfer speed, time remaining
    }, 60000); // 60000 ms = 1 minute

    try {
        await rcloneCopy(path, rcloneConfig, destinationPath);
    } finally {
        clearInterval(intervalId);
    }
};


export const getRcloneConfig = () => {
    const configPath = '/root/.config/rclone/rclone.conf';
    if (fs.existsSync(configPath) === false) {
        throw new Error(`rclone config file not found at ${configPath}, need to run 'rclone config'`);
    }
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config = ini.parse(configContent);

    return config['node-teslausb'];
}

export const rcloneCopy = async (sourcePath, rcloneConfig, destinationPath) => {
    if (fs.existsSync(sourcePath) === false) {
        logWithTimestamp(`Skipping rclone copy for ${sourcePath} (does not exist)`)
        return
    }
    logWithTimestamp(`Starting rclone copy for ${sourcePath}`)
    await executeBashCommand(`rclone copy ${sourcePath} ${rcloneConfig}:${destinationPath}/SentryClips -v --transfers=1 2>&1 | tee -a /logs/rclone.log`, false)

}