<script>
	// import { setAlive } from '../gameLogic';

	const setAlive = (i, j) => {
		boardState[i][j] = boardState[i][j] === 1 ? 0 : 1;
	};

	let boardState = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];
</script>

{#each boardState as row, i}
	<div class="row">
		{#each row as block, j (`${i}${j}`)}
			<button
				class={`block ${block === 1 ? 'black' : ''}`}
				on:click={() => setAlive(i, j)}
				on:mouseenter={() => setAlive(i, j)}
			></button>
		{/each}
	</div>
{/each}
