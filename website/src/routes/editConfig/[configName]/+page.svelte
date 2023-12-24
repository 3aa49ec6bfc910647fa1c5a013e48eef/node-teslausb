<script lang="ts">
	import { onMount } from 'svelte';
	import type { Readable } from 'svelte/store';
	import { createEditor, Editor, EditorContent } from 'svelte-tiptap';
	import StarterKit from '@tiptap/starter-kit';
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

	const save = () => {
		console.log($editor);
		console.log($editor?.getHTML());
	};

	const revert = () => {
		console.log('revert');
	};

	const load = async () => {
		console.log('load');
	};

	let editor: Readable<Editor>;

	onMount(async () => {
		console.log('onMount');
		let configContent = await getConfig(configName);
		editor = createEditor({
			extensions: [StarterKit],
			content: configContent
		});
	});
</script>

<div class="p-2">
    <div class="border border-gray-200 p-2 text-sm">
        <EditorContent editor={$editor} />
    </div>
	<button class="mt-2 mr-2" on:click={save}>Save</button>
	<button class="mt-2 bg-gray-500" on:click={revert}>Revert</button>
</div>
