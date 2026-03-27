<script lang="ts">
	import { MAP_ARRAY } from '$lib/constants/map/terrain';
	import { drawBlock } from '$lib/utils/draw';
	import { onMount } from 'svelte';

	onMount(() => {
		MAP_ARRAY.forEach((row, y) => {
			row.forEach((block, x) => {
				drawBlock(block, x, y);
			});
		});
	});
</script>
