import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import { promisify } from 'util';
import { exec } from 'child_process';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';

const isDevMode = process.env.NODE_ENV === 'development';

const execAsync = promisify(exec);

const updateComponent = async (componentName: string): Promise<boolean> => {

    switch (componentName) {
        case "all":
            await execAsync(`sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/upgrade.sh)"`);
            break;
        case "worker":
            await execAsync(`sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/helpers/install-worker.sh)" 2>&1 | tee /logs/upgrade-worker.log`);
            break;
        case "website":
            await execAsync(`sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/3aa49ec6bfc910647fa1c5a013e48eef/node-teslausb/main/deploy/helpers/install-website.sh)" 2>&1 | tee /logs/upgrade-website.log`);
            break;
        default:
            console.error(`Unknown component name: ${componentName}`);
            return false;
    }

	return true;
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

export async function GET({ request }) {
    // const logNames = Object.keys(logNameToPathMapping);
    return json({});
}

export const POST: RequestHandler = async (event: RequestEvent) => {
    // Convert ReadableStream to Buffer
    const buffer = await readableStreamToBuffer(event.request.body!);

    // Convert Buffer to string (assuming the content is text-based like JSON)
    const rawBody = buffer.toString();

    // Parse the string as JSON (if the content type is JSON)
    const parsedBody = JSON.parse(rawBody);

    const updateType = parsedBody.updateType;
    console.log("updateType:",updateType)

    await updateComponent(updateType);

    return new Response(JSON.stringify({ message: `OK` }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}