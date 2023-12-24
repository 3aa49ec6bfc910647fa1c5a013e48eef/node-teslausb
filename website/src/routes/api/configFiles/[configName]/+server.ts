import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { readFileSync, existsSync, unlinkSync } from 'fs';
import fs from 'fs';
import { configNameToPathMapping } from '$lib/constants';

const getConfigContent = (configName: string): string => {
    const configPath = configNameToPathMapping[configName];
    if (!configPath || !existsSync(configPath)) {
        return '';
    }

    try {
        return readFileSync(configPath, 'utf8');
    } catch (err) {
        console.error(`Error reading file: ${err}`);
        return '';
    }
};

export const GET: RequestHandler = async (event: RequestEvent) => {
    const configName = event.params.configName;
	const configContent = configName !== undefined ? (getConfigContent(configName)).replaceAll("\n","<br>").replaceAll(" ","&nbsp;") : "";

    console.log("configName:",configName, configContent)

    return new Response(JSON.stringify({ message: `Config name is: ${configName}`, content: configContent }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

export const PUT: RequestHandler = async (event: RequestEvent) => {
    // const logName = event.params.logName ?? "";
    // const logPath = logNameToPathMapping[logName];

    // clearLogFile(logPath);

    return new Response(JSON.stringify({ message: `OK` }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
