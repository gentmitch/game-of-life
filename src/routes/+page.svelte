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
	let height = 50;

	const createBoard = () => {
		return new Array(width).fill(0).map(() => new Array(width).fill(0));
	};

	const reset = () => {
		state = createBoard();
	};

	const setAlive = (i, j) => {
		state[i][j] = 1;
	};

	$: state = createBoard();

	onMount(() => {
		startingAlive.forEach((item, i) => {
			state[item[0]][item[1]] = 1;
		});
	});

	const isAlive = (x, y) => {
		return state[y] && state[y][x] == 1;
	};

	const countNeighbors = (x, y) => {
		const dirs = [
			[-1, -1],
			[-1, 0],
			[-1, 1],
			[0, -1],
			[0, 1],
			[1, -1],
			[1, 0],
			[1, 1]
		];
		let count = 0;

		for (let dir of dirs) {
			if (isAlive(x + dir[0], y + dir[1])) {
				count++;
			}
		}

		return count;
	};

	const nextGeneration = () => {
		console.log('LOGGING');
		const newBoard = createBoard();

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const neighbors = countNeighbors(x, y);

				if (isAlive(x, y)) {
					newBoard[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0;
				} else {
					newBoard[y][x] = neighbors === 3 ? 1 : 0;
				}
			}
		}

		state = newBoard;
	};
	// run();
</script>

<button on:click={() => nextGeneration()}>Next generation</button>
<button on:click={reset}>Reset</button>
<div class="container">
	{#each state as row, i}
		<div class="row">
			{#each row as block, j (`${i}:${j}`)}
				<div
					class={`block ${block === 1 ? 'black' : ''}`}
					on:click={() => setAlive(i, j)}
					id={`${i}:${j}`}
				/>
			{/each}
		</div>
	{/each}
</div>

<style>
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
