<script lang="ts">
	import { getTimeContext } from '$lib/contexts/time-context';
	import { getCircleRadius } from '$lib/utils/circle';
	import { draw } from '$lib/utils/draw';

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
		draw(
			(ctx, x, y) => {
				console.log(x, y);
				ctx.fillStyle = 'red';
				ctx.fillRect(x, y, 200, -200);
			},
			10,
			10
		);
	});
</script>
