import { json } from '@sveltejs/kit';
import { configNameToPathMapping } from '$lib/constants';

export async function GET({ request }) {
	const configNames = Object.keys(configNameToPathMapping);
	return json({ configFiles: configNames });
}