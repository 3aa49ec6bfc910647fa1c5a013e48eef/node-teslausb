<script lang="ts">
	import { onMount } from 'svelte';

	let a = 0;
	let b = 0;
	let total = 0;
	let logFiles: string[] = [];
	let finishedApiCalls = false;

	async function add() {
		const response = await fetch('/api/dashboard', {
			method: 'GET',
			body: JSON.stringify({ a, b }),
			headers: {
				'content-type': 'application/json'
			}
		});

		total = await response.json();
	}

	async function listLogFiles() {
		const response = await fetch('/api/logFiles', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		const logFiles = await response.json();
		console.log(logFiles.logFiles);

		return logFiles.logFiles;
	}

	onMount(async () => {
		logFiles = await listLogFiles();
		console.log(logFiles);
		finishedApiCalls = true;
	});
</script>

<h1>node-teslausb</h1>

<h2>Log Files</h2>
{#if finishedApiCalls == true}
	{#if logFiles.length == 0}
		<p>No log files found.</p>
	{:else}
		<ul>
			{#each logFiles as logFile}
				<li><a href={`/viewLog/${logFile}`}>{logFile}</a></li>
			{/each}
		</ul>
	{/if}
{:else}
	<p>Loading...</p>
{/if}

<!-- <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<input type="number" bind:value={a}> +
<input type="number" bind:value={b}> =
{total}

<button on:click={add}>Calculate</button> -->
