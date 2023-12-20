import ini from 'ini';
import { logWithTimestamp, errorWithTimestamp } from './log.js';
import fs from 'fs';
import { executeBashCommand } from './bash.js';

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
    await executeBashCommand(`rclone copy ${sourcePath} ${rcloneConfig}:${destinationPath}/SentryClips -vv --transfers=1 2>&1 | tee -a /logs/rclone.log`, false)

}