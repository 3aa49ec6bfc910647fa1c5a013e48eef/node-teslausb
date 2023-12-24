<script lang="ts">
	import { onMount } from 'svelte';
	import type { Readable } from 'svelte/store';
	import { createEditor, Editor, EditorContent } from 'svelte-tiptap';
	import StarterKit from '@tiptap/starter-kit';
	import { page } from '$app/stores';

	let isLoading = true;
    let configContent = ""

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
		isLoading = false;
		return configContent.content;
	}

    async function setConfig(configName: string, configContent: string) {
		isLoading = true;
		const response = await fetch(`/api/configFiles/${configName}`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/text'
			},
            body: configContent
		});

		const responseJson = await response.json();
		isLoading = false;
		return responseJson;
	}

	// let json: string = ""

	const save = async () => {
        console.log($editor?.getHTML())
        const updatedContent = $editor?.getHTML().replaceAll('<br>', '\n').replaceAll('&nbsp;&nbsp;&nbsp;&nbsp;', '\t').replaceAll('&nbsp;', ' ').replaceAll('</p><p>', '\n').replaceAll('<p>', '').replaceAll('</p>', '');
        await setConfig(configName, updatedContent);
        configContent = $editor?.getHTML()
	};

	const revert = () => {
		console.log('revert');
        $editor?.commands.setContent(configContent);
	};

	const load = async () => {
		console.log('load');
	};

	let editor: Readable<Editor>;

	onMount(async () => {
		console.log('onMount');
		configContent = (await getConfig(configName)).replaceAll('\n', '<br>').replaceAll('\t', '&nbsp;&nbsp;&nbsp;&nbsp;').replaceAll(' ', '&nbsp');
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
