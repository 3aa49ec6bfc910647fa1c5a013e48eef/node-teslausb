import path from 'path';
import ini from 'ini';
import { logWithTimestamp, errorWithTimestamp } from './log';

export const getRcloneConfig = () => {
    const configPath = '/root/.config/rclone/rclone.conf';
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config = ini.parse(configContent);

    return config['node-teslausb'];
}

export const rcloneCopy = async (sourcePath) => {
    if (fs.existsSync(sourcePath) === false) {
        logWithTimestamp(`Skipping rclone copy for ${sourcePath} (does not exist)`)
        return
    }
    logWithTimestamp(`Starting rclone copy for ${sourcePath}`)
    await executeBashCommand(`rclone copy ${sourcePath} ${config.archive.rcloneConfig}:${config.archive.destinationPath}/SentryClips -vv --transfers=1 2>&1 | tee -a /logs/rclone.log`)

}