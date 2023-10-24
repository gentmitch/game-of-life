<script>
	import { onMount } from 'svelte';

	let startingAlive = [
		[0, 0],
		[0, 1],
		[0, 2],
		[1, 0],
		[1, 1],
		[1, 2]
	];

	let width = 50;

	let state = new Array(width).fill(new Array(width).fill(0));

	onMount(() => {
		startingAlive.forEach((item, i) => {
			state[item[0]][item[1]] = 1;
		});
	});

	// const run = () => {
	// 	startingAlive.forEach((item) => {});
	// 	// while (true) {
	// 	// 	if (stop) break;
	// 	// }
	// };
	// run();
</script>

<button on:click={() => (stop = !stop)}> Toggle</button>
<div class="container">
	{#each state as row, i}
		<div class="row">
			{#each row as block, j (`${i}:${j}`)}
				{#if block === 1}
					<div class={`block black`} id={`${i}:${j}`} />
				{:else}
					<div class={`block`} id={`${i}:${j}`} />
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style>
	.container {
		/* display: grid; */
	}
	.row {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		display: flex;
	}

	.block {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		height: 20px;
		width: 20px;
		border: 1px solid black;
	}

	.black {
		background-color: black;
	}
</style>
