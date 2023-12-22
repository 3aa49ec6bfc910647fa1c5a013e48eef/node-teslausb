import { json } from '@sveltejs/kit';
import cheerio from 'cheerio';
import fs from 'fs/promises';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { Readable } from 'stream';

interface LockChime {
    title: string;
    url: string;
}

const getLockChimes = async (): Promise<LockChime[]> => {
    try {
        const url = 'https://teslapro.hu/lockchimes/';
        const html = await fetchHTML(url);
        return extractLockChimes(html);
    } catch (error) {
        console.error('Error fetching lock chimes:', error);
        return [];
    }
};

const fetchHTML = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error fetching ${url}: ${response.statusText}`);
    }
    return await response.text();
};

const extractLockChimes = (html: string): LockChime[] => {
    const $ = cheerio.load(html);
    const lockChimes: LockChime[] = [];

    $('.card').each((i, element) => {
        const title = $(element).find('.card-title').text().trim();
        let url = $(element).find('a').attr('href') ?? '';
        if (url) {
            url = `https://teslapro.hu/lockchimes/${url}`;
        }

        if (title && url) {
            lockChimes.push({ title, url });
        }
    });

    return lockChimes;
};

const downloadLockChime = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error fetching ${url}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = 'LockChime.wav';
    const tmpPath = `/tmp/${filename}`;

    await fs.writeFile(tmpPath, buffer);

    return tmpPath;
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
    const lockChimes = await getLockChimes();
    const sortedLockChimes = lockChimes.sort((a, b) => a.title.localeCompare(b.title));
    // const logNames = Object.keys(logNameToPathMapping);
    return json(sortedLockChimes);
}

export const POST: RequestHandler = async (event: RequestEvent) => {
    // Convert ReadableStream to Buffer
    const buffer = await readableStreamToBuffer(event.request.body!);

    // Convert Buffer to string (assuming the content is text-based like JSON)
    const rawBody = buffer.toString();

    // Parse the string as JSON (if the content type is JSON)
    const parsedBody = JSON.parse(rawBody);
    console.log("lockChimeUrl:",parsedBody)

    await downloadLockChime(parsedBody.url);

    return new Response(JSON.stringify({ message: `OK` }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

// Usage
// console.log(lockChimes)