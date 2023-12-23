import { json } from '@sveltejs/kit';
import { logNameToPathMapping } from '$lib/constants';

export async function GET({ request }) {
	const logNames = Object.keys(logNameToPathMapping);
	return json({ logFiles: logNames });
}