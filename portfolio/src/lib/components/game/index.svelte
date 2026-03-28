<script lang="ts">
	import { getControlContext } from '$lib/contexts/control-context';
	import { getEntityContext } from '$lib/contexts/entity-context';
	import { FPS } from '$lib/settings';
	import { onMount } from 'svelte';
	import { handleEntity } from './entity/handle-entity';
	import { handlePlayer } from './player/handle-player';

	const { getKeyMap } = getControlContext();
	const { getEntities, setEntities } = getEntityContext();

	onMount(() => {
		const interval = setInterval(() => {
			handleEntity(getEntities(), setEntities);
			handlePlayer(getKeyMap(), getEntities().player, (player) => setEntities('player', player));
		}, 1000 / FPS);
		return () => clearInterval(interval);
	});
</script>
