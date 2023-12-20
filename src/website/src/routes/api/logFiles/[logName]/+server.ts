import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { readFileSync, existsSync } from 'fs';
import { logNameToPathMapping } from '$lib/constants';

const getLogContent = (logName: string): string => {
    const logPath = logNameToPathMapping[logName];
    if (!logPath || !existsSync(logPath)) {
        return '';
    }

    try {
        return readFileSync(logPath, 'utf8');
    } catch (err) {
        console.error(`Error reading file: ${err}`);
        return '';
    }
};

export const GET: RequestHandler = async (event: RequestEvent) => {
    const logName = event.params.logName;
	const logContent = logName !== undefined ? getLogContent(logName) : "";

    return new Response(JSON.stringify({ message: `Log name is: ${logName}`, content: logContent }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};