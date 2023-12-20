<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let logContent: string = '';

	// Accessing the parameter
	$: logName = $page.params.logName;

	async function getLog(logName: string) {
		const response = await fetch(`/api/logFiles/${logName}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		const logContent = await response.json();
		console.log(logContent);
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
		console.log(deleteResponse);
	}

    const reloadLog = async (logName: string) => {
        logContent = await getLog(logName);
        scrollToBottom();
    }

	onMount(async () => {
		console.log(logName);
		logContent = await getLog(logName);
		console.log(logContent);
        scrollToBottom();
	});

	const scrollToBottom = () => {
		window.scrollTo(0, document.body.scrollHeight);
	};
</script>

<h1>Log file: {logName}</h1>

<pre>
    {logContent}
</pre>

<button on:click={() => reloadLog(logName)}>Reload</button>
<button on:click={() => clearLog(logName)}>Clear log</button>
