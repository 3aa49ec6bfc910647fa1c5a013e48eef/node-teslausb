import { promises as fsPromises } from 'fs';
import path from 'path';

export interface NodeTeslaUsbConfig {
    archive: {
        rcloneConfig: String,
        destinationPath: String
    },
    paths: {
        sentryClips: String,
        savedClips: String,
    },
    delayBetweenCopyRetryInSeconds: Number,
    mainLoopIntervalInSeconds: Number,
}

export const readConfigFile = async (filePath: string): Promise<NodeTeslaUsbConfig> => {
    try {
        const absolutePath = path.resolve(filePath);
        const fileContent = await fsPromises.readFile(absolutePath, 'utf-8');
        return JSON.parse(fileContent) as NodeTeslaUsbConfig;
    } catch (error) {
        console.error('Error reading the config file:', error);
        throw error;
    }
};