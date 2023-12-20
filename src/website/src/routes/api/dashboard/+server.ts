import { json, text } from '@sveltejs/kit';

export async function POST({ request }) {
	const { a, b } = await request.json();
	return json(a + b);
}

// This handler will respond to PUT, PATCH, DELETE, etc.
// /** @type {import('./$types').RequestHandler} */
export async function fallback({ request }) {
	return text(`I caught your ${request.method} request!`);
}