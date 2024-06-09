<script lang="ts">
	import { onMount, tick } from 'svelte';
	import patterns from '../../data.json';
	import { longpress } from '$lib/actions/longPress';
	import { once } from '$lib/utils/eventModifiers';
	// import Thing from './thing.svelte';

	let startingAlive = $state(patterns.oscillators.beacon);
	let toggleQueue: Array<{ i: number; j: number; state: number }> = $state([]);

	let width = 50;
	let height = 50;
	let playing = $state(false);
	let count = $state(0);
	let fps = $state(4);
	let mousedown = $state(false);
	let boardState = $state(createBoard());

	$effect.pre(() => {
		document.onkeydown = (e) => {
			if (e.key === ' ') {
				e.preventDefault();
				playing = !playing;
				if (playing) {
					run();
				}
			}
		};
	});

	function createBoard() {
		return new Array(width).fill(0).map(() => new Array(width).fill(0));
	}

	const reset = () => {
		boardState = createBoard();
		startingAlive.forEach((item, i) => {
			item.forEach((s, j) => {
				boardState[i + width / 2 - Math.floor(startingAlive.length / 2)][
					j + height / 2 - Math.floor(startingAlive[0].length / 2)
				] = s;
			});
		});
	};

	const isAlive = (x: number, y: number) => {
		return boardState[y] && boardState[y][x] == 1;
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

		dirs.forEach((dir) => {
			if (isAlive(x + dir[0], y + dir[1])) {
				count++;
			}
		});

		return count;
	};

	const randomGenaration = () => {
		// Get a random number between 0 and 100
		const random = Math.floor(Math.random() * 100);

		if (random > 50) {
			return true;
		} else {
			return false;
		}
	};

	const nextGeneration = async () => {
		const newBoard = createBoard();

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const neighbors = countNeighbors(x, y);

				if (count % 1000 === 0) {
					if (randomGenaration()) {
						newBoard[y][x] = 1;
					}
				}

				if (isAlive(x, y)) {
					newBoard[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0;
				} else {
					newBoard[y][x] = neighbors === 3 ? 1 : 0;
				}
			}
		}
		count++;

		boardState = newBoard;
	};

	function run() {
		if (!playing) return;
		nextGeneration();

		if (fps > 0) {
			setTimeout(() => {
				window.requestAnimationFrame(run);
			}, 1000 / fps);
			return;
		}
		window.requestAnimationFrame(run);
	}

	const stop = () => {
		playing = false;
	};

	const onMouseMove = (
		e: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		},
		i: number,
		j: number
	): void => {
		if (e.type === 'mouseover' && !mousedown) return;
		toggleState(i, j);
		// e.preventDefault();
		e.currentTarget.blur();
	};

	const toggleState = (i: number, j: number) => {
		boardState[i][j] = boardState[i][j] === 1 ? 0 : 1;
	};
</script>

<div class="flex justify-center items-center flex-row">
	<div class="flex flex-col px-4 items-start gap-2">
		{#each Object.entries(patterns) as groups}
			<h2 class="text-2xl font-bold">{groups[0]}</h2>
			{#each Object.entries(groups[1]) as pattern}
				<div class="flex justify-center items-center">
					<button
						class="btn btn-accent"
						onclick={() => {
							startingAlive = pattern[1];
							reset();
						}}>{pattern[0]}</button
					>
				</div>
			{/each}
		{/each}
	</div>
	<div>
		<div class="py-4">
			<button
				class="btn btn-accent"
				onclick={async () => {
					if (playing) {
						stop();
						return;
					}
					playing = true;
					run();
				}}>{playing ? 'Stop' : 'Run'}</button
			>
			<button
				class="btn btn-accent"
				onclick={() => nextGeneration()}
				use:longpress
				onlongpress={() => nextGeneration()}>Next generation</button
			>
		</div>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="items-center"
			onmouseup={(_) => (mousedown = false)}
			onmousedown={(_) => (mousedown = true)}
		>
			{#each boardState as row, i}
				<div class="m-0 p-0 flex box-border">
					{#each row as block, j (`${i}${j}`)}
						<button
							class={`btn-ghost outline-none h-[20px] w-[20px] border border-slate-400 ${
								block === 1 ? 'bg-slate-400' : ''
							}`}
							onclick={(event) => onMouseMove(event, i, j)}
							onmouseover={(event) => onMouseMove(event, i, j)}
						></button>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>
