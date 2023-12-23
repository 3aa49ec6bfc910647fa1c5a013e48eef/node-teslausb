import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { readFileSync, existsSync, unlinkSync } from 'fs';
import fs from 'fs';
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

// const deleteLogFile = (logName: string | undefined): void => {
//     const logPath = logNameToPathMapping[logName ?? ""];
//     if (!logPath || !existsSync(logPath)) {
//         return;
//     }

//     try {
//         unlinkSync(logPath);
//     } catch (err) {
//         console.error(`Error deleting file: ${err}`);
//     }
// }

const clearLogFile = (logPath: string | undefined) => {

    console.log("clearLogFile:",logPath)

    if (!logPath || !existsSync(logPath)) {
        return;
    }

    fs.truncate(logPath, 0, (err) => {
      if (err) {
        console.error('Error truncating file:', err);
        return;
      }
      console.log('Log file cleared:', logPath);
    });
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

export const DELETE: RequestHandler = async (event: RequestEvent) => {
    const logName = event.params.logName ?? "";
    const logPath = logNameToPathMapping[logName];

    clearLogFile(logPath);

    return new Response(JSON.stringify({ message: `OK` }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
