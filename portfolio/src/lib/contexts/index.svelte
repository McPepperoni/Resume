<script lang="ts">
	import { TIME } from '$lib/constants/time';
	import type { Snippet } from 'svelte';
	import { setCanvasContext } from './canvas-context';
	import { setControlContext, type KEY_MAP } from './control-context';
	import { setEntityContext, type ENTITY } from './entity-context';
	import { setTimeContext } from './time-context';

	type Props = {
		children: Snippet;
	};

	const { children }: Props = $props();

	let time = $state<(typeof TIME)[keyof typeof TIME]>(TIME.DAY);
	let canvas = $state<HTMLCanvasElement | null>(null);
	let width = $state(0);
	let height = $state(0);

	let keyMap = $state<KEY_MAP>({
		up: false,
		down: false,
		left: false,
		right: false,
		space: false,
		escape: false
	});

	let entities = $state<Record<string, ENTITY>>({
		player: {
			x: 0,
			y: 0,
			facing: 'right',
			boundingBox: {
				x: 0,
				y: 0,
				width: 16,
				height: 16
			},
			gravityAffected: true
		}
	});

	setTimeContext({ getTime: () => time, setTime: (_time) => (time = _time) });
	setCanvasContext({
		getCanvas: () => canvas,
		setCanvas: (_canvas) => (canvas = _canvas),
		resolution: 128
	});
	setControlContext({
		getKeyMap: () => keyMap,
		keysPressed: (_keys) => {
			let next = { ...keyMap };
			_keys.forEach((key) => {
				next[key] = true;
			});
			keyMap = next;
		},
		keysReleased: (_keys) => {
			let next = { ...keyMap };
			_keys.forEach((key) => {
				next[key] = false;
			});
			keyMap = next;
		}
	});
	setEntityContext({
		getEntities: () => entities,
		setEntities: (id, entity) => (entities[id] = entity)
	});
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<div style="width: {width}px; height: {height}px;">
	<canvas bind:this={canvas} style="width: {width}px; height: {height}px;" {width} {height}
	></canvas>
	<div class="absolute top-0 left-0">
		{@render children()}
	</div>
</div>
