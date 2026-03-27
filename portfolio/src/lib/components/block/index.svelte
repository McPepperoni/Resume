<script lang="ts">
	import { TERRAIN } from '$lib/constants/map/terrain';

	type Props = {
		type: (typeof TERRAIN)[keyof typeof TERRAIN];
		resolution: number;
		canvas: HTMLCanvasElement;
	};

	let { type, resolution, canvas }: Props = $props();

	$effect(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Failed to get canvas context');
		}
		ctx.fillStyle = type === TERRAIN.DIRT ? 'brown' : 'yellow';
		ctx.fillRect(0, 0, resolution, resolution);
	});
</script>
