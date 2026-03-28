<script lang="ts">
	import { getControlContext } from '$lib/contexts/control-context';

	const { keysPressed, keysReleased } = getControlContext();

	const handleKeyDown = (e: KeyboardEvent) => {
		switch (e.code) {
			case 'ArrowUp':
			case 'KeyW':
				keysPressed(['up']);
				break;
			case 'ArrowDown':
			case 'KeyS':
				keysPressed(['down']);
				break;
			case 'ArrowLeft':
			case 'KeyA':
				keysPressed(['left']);
				break;
			case 'ArrowRight':
			case 'KeyD':
				keysPressed(['right']);
				break;
			case 'Space':
				keysPressed(['space']);
				break;
			case 'Escape':
				keysPressed(['escape']);
				break;
		}
	};

	const handleKeyUp = (e: KeyboardEvent) => {
		switch (e.code) {
			case 'ArrowUp':
			case 'KeyW':
				keysReleased(['up']);
				break;
			case 'ArrowDown':
			case 'KeyS':
				keysReleased(['down']);
				break;
			case 'ArrowLeft':
			case 'KeyA':
				keysReleased(['left']);
				break;
			case 'ArrowRight':
			case 'KeyD':
				keysReleased(['right']);
				break;
			case 'Space':
				keysReleased(['space']);
				break;
			case 'Escape':
				keysReleased(['escape']);
				break;
		}
	};
</script>

<svelte:window on:keydown|preventDefault={handleKeyDown} on:keyup|preventDefault={handleKeyUp} />
