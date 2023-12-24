import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { readFileSync, existsSync, unlinkSync, writeFileSync } from 'fs';
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

const setConfigContent = (configName: string, content: string): boolean => {
    const configPath = configNameToPathMapping[configName];
    if (!configPath) {
        console.error(`No path found for config: ${configName}`);
        return false;
    }

    try {
        writeFileSync(configPath, content, 'utf8');
        return true;
    } catch (err) {
        console.error(`Error writing file: ${err}`);
        return false;
    }
};

export const GET: RequestHandler = async (event: RequestEvent) => {
    const configName = event.params.configName;
	const configContent = configName !== undefined ? (getConfigContent(configName)) : "";

    // console.log("configName:",configName, configContent)

    return new Response(JSON.stringify({ message: `Config name is: ${configName}`, content: configContent }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

async function readableStreamToBuffer(readable: ReadableStream<Uint8Array>): Promise<Buffer> {
    const reader = readable.getReader();
    const chunks: Uint8Array[] = [];

    //eslint-disable-next-line no-constant-condition
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
    }

    return Buffer.concat(chunks);
}

export const PUT: RequestHandler = async (event: RequestEvent) => {

    const configName = event.params.configName ?? "";
    const buffer = await readableStreamToBuffer(event.request.body!);

    // Convert Buffer to string (assuming the content is text-based like JSON)
    const rawBody = buffer.toString();

    setConfigContent(configName, rawBody);

    return new Response(JSON.stringify({ message: `OK` }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
