<script lang="ts">
	import { Contexts } from '$lib';
	import favicon from '$lib/assets/favicon.svg';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Contexts>
	{@render children()}
</Contexts>
