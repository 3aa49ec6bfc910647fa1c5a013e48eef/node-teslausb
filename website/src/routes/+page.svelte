<script lang="ts">
	import { onMount } from 'svelte';

	let a = 0;
	let b = 0;
	let total = 0;
	let logFiles: string[] = [];
	let finishedApiCalls = false;
	let lockChimes: any[] = [];
	let selectedUrl = '';

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

	async function getLockChimes() {
		const response = await fetch('/api/lockChimes', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		const lockChimes = await response.json();
		console.log(lockChimes);

		return lockChimes;
	}

	const installLockChime = async () => {
		const response = await fetch('/api/lockChimes', {
			method: 'POST',
			body: JSON.stringify({ url: selectedUrl }),
			headers: {
				'content-type': 'application/json'
			}
		});

		const installResponse = await response.json();
		console.log(installResponse);
	};

	onMount(async () => {
		logFiles = await listLogFiles();
		lockChimes = await getLockChimes();
		console.log(logFiles);
		finishedApiCalls = true;
	});
</script>

<div class="p-2">
	<h2>Log Files</h2>
	{#if finishedApiCalls == true}
		{#if logFiles.length == 0}
			<p>No log files found.</p>
		{:else}
			<ul class="list-disc">
				{#each logFiles as logFile}
					<li><a href={`/viewLog/${logFile}`}>{logFile}</a></li>
				{/each}
			</ul>
		{/if}
	{:else}
		<p>Loading...</p>
	{/if}

	{#if finishedApiCalls}
		<h2>Lock Chimes</h2>
		{#if lockChimes.length == 0}
			<p>No lock chimes found.</p>
		{:else}
			<select bind:value={selectedUrl}>
				{#each lockChimes as lockChime}
					<option value={lockChime.url}>{lockChime.title}</option>
				{/each}
			</select>
			<button on:click={installLockChime}>Install</button>
		{/if}
		<div class="text-sm pt-1">
			Visit <a href="https://teslapro.hu/lockchimes/">https://teslapro.hu/lockchimes/</a> to listen
			to lock sounds before installing.
			<p class="pt-2">
				<i
					>Note: currently, installation will happen within 2 minutes if no data is being synced.
					Otherwise it will run once the sync finishes.</i
				>
			</p>
		</div>
	{/if}
</div>
<!-- <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<input type="number" bind:value={a}> +
<input type="number" bind:value={b}> =
{total}

<button on:click={add}>Calculate</button> -->
