<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let logContent: string = '';
	let isLoading = true;

	$: logName = $page.params.logName;

	async function getLog(logName: string) {
		isLoading = true;
		const response = await fetch(`/api/logFiles/${logName}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		const logContent = await response.json();
		// console.log(logContent);
		isLoading = false;
		return logContent.content;
	}

	async function clearLog(logName: string) {
		const response = await fetch(`/api/logFiles/${logName}`, {
			method: 'DELETE',
			headers: {
				'content-type': 'application/json'
			}
		});

		const deleteResponse = await response.json();
		// console.log(deleteResponse);
		reloadLog(logName);
	}

	const reloadLog = async (logName: string) => {
		logContent = await getLog(logName);
		scrollToBottom();
	};

	onMount(async () => {
		console.log(logName);
		logContent = await getLog(logName);
		console.log(logContent);
		scrollToBottom();
	});

	// bit of a hack but might work
	const scrollToBottom = () => {
		setTimeout(() => {
			window.scrollTo(0, document.body.scrollHeight);
		}, 0);
	};
</script>

<h1>Log file: {logName}</h1>

{#if isLoading}
	<p>Loading...</p>
{/if}
{#if !isLoading && logContent === ''}
	<p>Log is empty.</p>
{/if}
<pre>
    {logContent}
</pre>

<button on:click={() => reloadLog(logName)}>Reload</button>
<button on:click={() => clearLog(logName)}>Clear log</button>
