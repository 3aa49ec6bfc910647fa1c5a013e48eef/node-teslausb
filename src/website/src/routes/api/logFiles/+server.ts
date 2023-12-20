import { json } from '@sveltejs/kit';
import { logNameToPathMapping } from '$lib/constants';

export async function GET({ request }) {
	console.log(request)
	const logNames = Object.keys(logNameToPathMapping);
	return json({ message: "Provide log name in path.", logFiles: logNames });
}