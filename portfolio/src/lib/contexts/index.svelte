<script lang="ts">
	import { TIME } from '$lib/constants/time';
	import type { Snippet } from 'svelte';
	import { setCanvasContext } from './canvas-context';
	import { setTimeContext } from './time-context';

	type Props = {
		children: Snippet;
	};

	const { children }: Props = $props();

	let time = $state<(typeof TIME)[keyof typeof TIME]>(TIME.DAY);
	let canvas = $state<HTMLCanvasElement | null>(null);
	let width = $state(0);
	let height = $state(0);

	setTimeContext({ getTime: () => time, setTime: (_time) => (time = _time) });
	setCanvasContext({ getCanvas: () => canvas, setCanvas: (_canvas) => (canvas = _canvas) });
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<div style="width: {width}px; height: {height}px;">
	<canvas bind:this={canvas} style="width: {width}px; height: {height}px;" {width} {height}
	></canvas>
	<div class="absolute top-0 left-0">
		{@render children()}
	</div>
</div>
