<script lang="ts">
	import { onMount } from 'svelte';
	import Editor from 'cl-editor/src/Editor.svelte';
	import { page } from '$app/stores';

	let isLoading = true;

	$: configName = $page.params.configName;

	async function getConfig(configName: string) {
		isLoading = true;
		const response = await fetch(`/api/configFiles/${configName}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/text'
			}
		});

		const configContent = await response.json();
		// console.log(configContent);
		isLoading = false;
		return configContent.content;
	}

	// let json: string = ""

	let html = 'Loading content...';

	let actions = ['removeFormat'];
	let height = 'auto';

	const save = () => {
		console.log(html);
	};

	const revert = () => {
		console.log('revert');
	};

	const load = async () => {
		console.log('load');
	};

	onMount(async () => {
		console.log('onMount');
		let json = await getConfig(configName);
		html = json;
	});
</script>

<div class="p-2">
	{#if html !== 'Loading content...'}
		<Editor {html} on:change={(evt) => (html = evt.detail)} {actions} {height} />
	{:else}
		<p>Loading config...</p>
	{/if}

	<button class="mt-2 mr-2" on:click={save}>Save</button>
	<button class="mt-2 bg-gray-500" on:click={revert}>Revert</button>
</div>
