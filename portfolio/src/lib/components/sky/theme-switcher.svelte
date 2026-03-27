<script lang="ts">
	import { TIME } from '$lib/constants/time';
	import { getTimeContext } from '$lib/contexts/time-context';

	type Props = {
		time: (typeof TIME)[keyof typeof TIME];
		position: {
			x: number;
			y: number;
		};
	};

	let { time = TIME.DAY, position = { x: 0, y: 0 } }: Props = $props();
	const { setTime } = getTimeContext();
</script>

<button
	aria-label="Switch theme"
	style="top: {position.y}px; left: {position.x}px;"
	class="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-105 hover:rotate-12 {time ===
	TIME.DAY
		? 'bg-amber-400'
		: 'bg-slate-300'} aspect-square w-20"
	onclick={() => {
		setTime(time === TIME.DAY ? TIME.NIGHT : TIME.DAY);
	}}
>
</button>
