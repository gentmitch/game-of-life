<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/components/Scene.svelte';

	let width: number;
	let height: number;
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<div class="h-full w-full">
	<Canvas size={{ height, width }}>
		<Scene />
	</Canvas>
</div>
