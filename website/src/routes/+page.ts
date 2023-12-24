import type { Load } from '@sveltejs/kit';
import { logNameToPathMapping, configNameToPathMapping } from '$lib/constants';

export const load: Load = async ({ params }) => {

    const logNames = Object.keys(logNameToPathMapping);
    const configNames = Object.keys(configNameToPathMapping);

    return {
        logFiles: logNames,
        configFiles: configNames,
    };
};

export interface Data {
    logFiles: string[];
    configFiles: string[];
    // lockChimes remain as API due to CORS
}
