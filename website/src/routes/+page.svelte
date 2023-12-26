<script lang="ts">
	import type { Data } from './+page.js';
	import { onMount } from 'svelte';

	export let data: Data;

	let logFiles: string[] = [];
	let configFiles: string[] = [];
	let finishedApiCalls = false;
	let lockChimes: any[] = [];
	let selectedUrl = '';
	let dashboardData: any = {};

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

	const getDashboardData = async () => {
		const response = await fetch('/api/dashboard', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		const dashboardData = await response.json();
		console.log("dashboardData:",dashboardData);

		return dashboardData;
	};

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

	const updateAll = async () => {
		const response = await fetch('/api/update', {
			method: 'POST',
			body: JSON.stringify({ updateType: 'all' }),
			headers: {
				'content-type': 'application/json'
			}
		});

		const updateResponse = await response.json();
		console.log(updateResponse);
	};

	const updateWorker = async () => {
		const response = await fetch('/api/update', {
			method: 'POST',
			body: JSON.stringify({ updateType: 'worker' }),
			headers: {
				'content-type': 'application/json'
			}
		});

		const updateResponse = await response.json();
		console.log(updateResponse);
	};

	const updateWebsite = async () => {
		const response = await fetch('/api/update', {
			method: 'POST',
			body: JSON.stringify({ updateType: 'website' }),
			headers: {
				'content-type': 'application/json'
			}
		});

		const updateResponse = await response.json();
		console.log(updateResponse);
	};

	onMount(async () => {
		logFiles = data.logFiles;
		configFiles = data.configFiles;
		lockChimes = await getLockChimes();
		dashboardData = await getDashboardData();
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

	<h2>Config Files</h2>
	{#if finishedApiCalls == true}
		{#if configFiles.length == 0}
			<p>No log files found.</p>
		{:else}
			<ul class="list-disc">
				{#each configFiles as configFile}
					<li><a href={`/editConfig/${configFile}`}>{configFile}</a></li>
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

<div class="p-2">
	<h2>Stats</h2>
	Uptime: {dashboardData.uptime}
</div>

<div class="p-2">
	<h2>Software Updates</h2>
	<button class="mt-2 mr-2" on:click={updateAll}>Update All</button>
	<button class="mt-2 mr-2" on:click={updateWorker}>Update Worker</button>
	<button class="mt-2 mr-2" on:click={updateWebsite}>Update Website</button>
</div>

<!-- <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<input type="number" bind:value={a}> +
<input type="number" bind:value={b}> =
{total}

<button on:click={add}>Calculate</button> -->
