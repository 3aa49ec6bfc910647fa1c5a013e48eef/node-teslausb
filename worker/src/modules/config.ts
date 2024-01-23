import { promises as fsPromises } from 'fs';
import path from 'path';

export interface NodeTeslaUsbConfig {
    archive: {
        rcloneConfig: string,
    },
    paths: {
        source: string,
        destination: string,
    }[],
    delayBetweenCopyRetryInSeconds: number,
    mainLoopIntervalInSeconds: number,
    autoUpdate: { // add to default config
        enabled: boolean,
        checkInterval: number
    },
    wireless: { // add to default config
        hotspot: {
            enabled: boolean,
            ssid: string,
            password: string,
        },
        networks: {
            ssid: string,
            password: string,
            priority: number,
            hidden: boolean //todo: add functionality to handle hidden networks
        }[],
        refreshInterval: number
    }
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