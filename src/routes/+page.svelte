<script lang="ts">
	import { onMount, tick } from 'svelte';
	import patterns from '../data.json';
	let startingAlive = patterns.patterns.spaceships.glider;

	let width = 50;
	let height = 50;
	$: playing = false;

	const createBoard = () => {
		return new Array(width).fill(0).map(() => new Array(width).fill(0));
	};

	const reset = () => {
		state = createBoard();
		startingAlive.forEach((item, i) => {
			item.forEach((s, j) => {
				state[i][j] = s;
			});
		});
	};

	const setAlive = (i: number, j: number) => {
		state[i][j] = 1;
	};

	let state = createBoard();

	onMount(() => {
		reset();
	});

	const isAlive = (x: number, y: number) => {
		return state[y] && state[y][x] == 1;
	};

	const countNeighbors = (x: number, y: number) => {
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

	const nextGeneration = async () => {
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
		if (!playing) return;
		tick();
		window.requestAnimationFrame(nextGeneration);
	};
	const run = async () => {
		playing = true;
		window.requestAnimationFrame(nextGeneration);
	};
</script>

<button on:click={() => nextGeneration()}>Next generation</button>
<button on:click={reset}>Reset</button>
<button on:click={() => (playing = !playing)}> Stop</button>
<button on:click={async () => run()}>Run</button>
<div class="container">
	{#each state as row, i}
		<!-- I know I should use a button, lifes to show to unset all -->
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
