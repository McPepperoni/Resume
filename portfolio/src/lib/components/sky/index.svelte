<script lang="ts">
	import { getCanvasContext } from '$lib/contexts/canvas-context';
	import { getTimeContext } from '$lib/contexts/time-context';
	import { getCircleRadius } from '$lib/utils/circle';

	const { getTime } = getTimeContext();

	console.log(getTime());

	let width = $state(400);
	let height = $state(225);

	const r = $derived(getCircleRadius(0, 0, width / 2, height));

	const relativeWidth = 200;
	const relativeHeight = $derived((width !== 0 ? height / (width / 2) : 0) * relativeWidth);
	const switcherOffset = $derived({
		x: r - width / 2 + relativeWidth,
		y: r - height + relativeHeight
	});

	$effect(() => {
		const canvas = getCanvasContext().getCanvas();
		if (!canvas) {
			return;
		}
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}
		ctx.fillStyle = 'red';
		ctx.fillRect(0, 0, width, height);
	});
</script>
