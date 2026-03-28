<script lang="ts">
	import { MAP_ARRAY, TERRAIN } from '$lib/constants/map/terrain';
	import { getCanvasContext } from '$lib/contexts/canvas-context';
	import { getEntityContext } from '$lib/contexts/entity-context';
	import { drawBlock } from '$lib/utils/draw';

	const { getEntities } = getEntityContext();
	const { getCanvas } = getCanvasContext();

	$effect(() => {
		const p = getEntities()['player'];
		const canvas = getCanvas();
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		MAP_ARRAY.forEach((row, y) => {
			row.forEach((block, x) => {
				drawBlock(block, x, y);
			});
		});
		drawBlock(TERRAIN.SAND, p.x, p.y);
	});
</script>
