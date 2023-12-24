import type { Load } from '@sveltejs/kit';
import { logNameToPathMapping, configNameToPathMapping } from '$lib/constants';

export const load: Load = async ({ params }) => {

    const logNames = Object.keys(logNameToPathMapping);
    const configNames = Object.keys(configNameToPathMapping);
    // const uptime = getOperatingSystemUptime();

    return {
        logFiles: logNames,
        configFiles: configNames,
        // uptime: uptime
    };
};

export interface Data {
    logFiles: string[];
    configFiles: string[];
    // uptime: string;
    // lockChimes remain as API due to CORS
}

