<script>
	import { onMount } from 'svelte';

	let canvas;
	let comparisonCanvas;
	let ctx;
	let comparisonCtx;

	// Game state
	let steps = $state(5);
	let paths = $derived.by(() => buildPaths(steps));
	let currentPathIndex = $state(0);
	let isAnimating = $state(false);

	function formatCurrentPath() {
		if (currentPathIndex > 0 && currentPathIndex <= paths.length) {
			return `${currentPathIndex}/${paths.length}: ${paths[currentPathIndex - 1].map((s) => `+${s}`).join(' ')}`;
		}
		return '-';
	}

	onMount(() => {
		if (!canvas || !comparisonCanvas) return;
		ctx = canvas.getContext('2d');
		comparisonCtx = comparisonCanvas.getContext('2d');
		currentPathIndex = 0;
		draw();
	});

	// Recalculate and redraw when steps change
	$effect(() => {
		steps;
		currentPathIndex = 0;
	});

	$effect(() => {
		paths;
		currentPathIndex;
		draw();
	});

	function buildPaths(stepCount) {
		const result = [];
		const findPaths = (currentStep, currentPath) => {
			if (currentStep === stepCount) {
				result.push([...currentPath]);
				return;
			}

			if (currentStep > stepCount) {
				return;
			}

			// Take 1 step
			currentPath.push(1);
			findPaths(currentStep + 1, currentPath);
			currentPath.pop();

			// Take 2 steps
			currentPath.push(2);
			findPaths(currentStep + 2, currentPath);
			currentPath.pop();
		};

		findPaths(0, []);
		return result;
	}

	function draw() {
		if (!canvas || !comparisonCanvas || !ctx || !comparisonCtx) return;

		// Clear canvases
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		comparisonCtx.clearRect(0, 0, comparisonCanvas.width, comparisonCanvas.height);

		// Draw staircase
		drawStaircase();

		// Draw current path if any
		if (currentPathIndex > 0 && currentPathIndex <= paths.length) {
			drawPath(paths[currentPathIndex - 1]);
		}

		// Draw comparison visualization
		drawComparison();
	}

	function drawStaircase() {
		if (!canvas) return;
		const stepWidth = 60;
		const stepHeight = 40;
		const startX = 50;
		const startY = canvas.height - 50;

		// Draw ground
		ctx.fillStyle = '#e5e7eb';
		ctx.fillRect(0, startY, canvas.width, 50);

		// Draw each step
		for (let i = 0; i <= steps; i++) {
			const x = startX + i * stepWidth;
			const y = startY - i * stepHeight;

			// Step platform
			ctx.fillStyle = '#8b5cf6';
			ctx.strokeStyle = '#5b21b6';
			ctx.lineWidth = 3;

			ctx.fillRect(x, y, stepWidth, stepHeight);
			ctx.strokeRect(x, y, stepWidth, stepHeight);

			// Step number
			ctx.fillStyle = 'white';
			ctx.font = 'bold 20px Arial';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(i, x + stepWidth / 2, y + stepHeight / 2);
		}
	}

	function drawPath(path) {
		const stepWidth = 60;
		const stepHeight = 40;
		const startX = 50;
		const startY = canvas.height - 50;

		let currentStep = 0;
		let x = startX + stepWidth / 2;
		let y = startY + stepHeight / 2;

		// Draw circle at start
		ctx.fillStyle = '#10b981';
		ctx.beginPath();
		ctx.arc(x, y, 12, 0, Math.PI * 2);
		ctx.fill();

		// Draw path
		for (let stepSize of path) {
			currentStep += stepSize;
			x = startX + currentStep * stepWidth + stepWidth / 2;
			y = startY - currentStep * stepHeight + stepHeight / 2;

			// Draw arc for the step
			ctx.strokeStyle = stepSize === 1 ? '#3b82f6' : '#ef4444';
			ctx.lineWidth = 4;
			ctx.lineCap = 'round';
			ctx.beginPath();
			const prevX = startX + (currentStep - stepSize) * stepWidth + stepWidth / 2;
			const prevY = startY - (currentStep - stepSize) * stepHeight + stepHeight / 2;
			ctx.moveTo(prevX, prevY);
			ctx.lineTo(x, y);
			ctx.stroke();

			// Draw label for step size
			const midX = (prevX + x) / 2;
			const midY = (prevY + y) / 2;
			ctx.fillStyle = stepSize === 1 ? '#3b82f6' : '#ef4444';
			ctx.font = 'bold 16px Arial';
			ctx.textAlign = 'center';
			ctx.fillText(`+${stepSize}`, midX, midY - 15);
		}

		// Draw circle at end
		ctx.fillStyle = '#ef4444';
		ctx.beginPath();
		ctx.arc(x, y, 12, 0, Math.PI * 2);
		ctx.fill();
	}

	function drawComparison() {
		if (!comparisonCanvas || !comparisonCtx) return;
		if (steps === 1) {
			drawSingleStaircaseComparison();
		} else if (steps === 2) {
			drawTwoStaircaseComparison();
		} else {
			drawThreeStaircaseComparison();
		}
	}

	function calculatePathsForN(n) {
		const tempPaths = [];
		const findPaths = (currentStep, currentPath) => {
			if (currentStep === n) {
				tempPaths.push([...currentPath]);
				return;
			}
			if (currentStep > n) return;

			currentPath.push(1);
			findPaths(currentStep + 1, currentPath);
			currentPath.pop();

			currentPath.push(2);
			findPaths(currentStep + 2, currentPath);
			currentPath.pop();
		};

		findPaths(0, []);
		return tempPaths;
	}

	function drawMiniStaircase(ctx, n, offsetX, offsetY, scale, color, showAllPaths = false) {
		const stepWidth = 50 * scale;
		const stepHeight = 35 * scale;
		const startX = offsetX;
		const startY = offsetY;

		const miniPaths = calculatePathsForN(n);

		// Draw staircase steps
		for (let i = 0; i <= n; i++) {
			const x = startX + i * stepWidth;
			const y = startY - i * stepHeight;

			ctx.fillStyle = color;
			ctx.strokeStyle = darkenColor(color);
			ctx.lineWidth = 2;
			ctx.fillRect(x, y, stepWidth, stepHeight);
			ctx.strokeRect(x, y, stepWidth, stepHeight);

			// Step number
			ctx.fillStyle = 'white';
			ctx.font = `bold ${14 * scale}px Arial`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(i, x + stepWidth / 2, y + stepHeight / 2);
		}

		// Optionally draw all paths
		if (showAllPaths) {
			miniPaths.forEach((path) => {
				ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
				ctx.lineWidth = 2;
				ctx.lineCap = 'round';

				let currentStep = 0;
				let x = startX + stepWidth / 2;
				let y = startY + stepHeight / 2;

				ctx.beginPath();
				ctx.moveTo(x, y);

				for (let stepSize of path) {
					currentStep += stepSize;
					x = startX + currentStep * stepWidth + stepWidth / 2;
					y = startY - currentStep * stepHeight + stepHeight / 2;
					ctx.lineTo(x, y);
				}

				ctx.stroke();
			});
		}

		return {
			count: miniPaths.length,
			centerX: startX + (n * stepWidth) / 2,
			topY: startY - n * stepHeight - 20,
			bottomY: startY + stepHeight + 10
		};
	}

	function darkenColor(hexColor) {
		const colorMap = {
			'#ef4444': '#dc2626',
			'#f59e0b': '#d97706',
			'#10b981': '#059669',
			'#8b5cf6': '#5b21b6'
		};
		return colorMap[hexColor] || '#000000';
	}

	function drawThreeStaircaseComparison() {
		const canvasWidth = comparisonCanvas.width;
		const canvasHeight = comparisonCanvas.height;

		const scale = Math.min(1.0, 8 / steps);

		const spacing = canvasWidth / 4;
		const baseY = canvasHeight - 80;

		const n2 = steps - 2;
		const info1 = drawMiniStaircase(comparisonCtx, n2, spacing * 0.5, baseY, scale, '#ef4444', true);

		const n1 = steps - 1;
		const info2 = drawMiniStaircase(comparisonCtx, n1, spacing * 1.5, baseY, scale, '#f59e0b', true);

		const info3 = drawMiniStaircase(comparisonCtx, steps, spacing * 2.5, baseY, scale, '#10b981', true);

		// Draw labels
		comparisonCtx.fillStyle = '#1f2937';
		comparisonCtx.font = 'bold 16px Arial';
		comparisonCtx.textAlign = 'center';

		comparisonCtx.fillText(`N-2 = ${n2}`, info1.centerX, info1.bottomY);
		comparisonCtx.fillStyle = '#667eea';
		comparisonCtx.font = 'bold 20px Arial';
		comparisonCtx.fillText(`${info1.count} ways`, info1.centerX, info1.bottomY + 25);

		comparisonCtx.fillStyle = '#1f2937';
		comparisonCtx.font = 'bold 16px Arial';
		comparisonCtx.fillText(`N-1 = ${n1}`, info2.centerX, info2.bottomY);
		comparisonCtx.fillStyle = '#667eea';
		comparisonCtx.font = 'bold 20px Arial';
		comparisonCtx.fillText(`${info2.count} ways`, info2.centerX, info2.bottomY + 25);

		comparisonCtx.fillStyle = '#1f2937';
		comparisonCtx.font = 'bold 16px Arial';
		comparisonCtx.fillText(`N = ${steps}`, info3.centerX, info3.bottomY);
		comparisonCtx.fillStyle = '#667eea';
		comparisonCtx.font = 'bold 20px Arial';
		comparisonCtx.fillText(`${info3.count} ways`, info3.centerX, info3.bottomY + 25);

		// Draw equation
		const centerX = canvasWidth / 2;
		comparisonCtx.fillStyle = '#1f2937';
		comparisonCtx.font = 'bold 24px Arial';
		comparisonCtx.textAlign = 'center';
		const equation = `${info1.count} + ${info2.count} = ${info3.count}`;
		comparisonCtx.fillText(equation, centerX, 30);

		comparisonCtx.font = '16px Arial';
		comparisonCtx.fillStyle = '#6b7280';
		comparisonCtx.fillText('ways(N-2) + ways(N-1) = ways(N)', centerX, 55);
	}

	function drawTwoStaircaseComparison() {
		const canvasWidth = comparisonCanvas.width;
		const baseY = comparisonCanvas.height - 100;

		const spacing = canvasWidth / 3;

		const info1 = drawMiniStaircase(comparisonCtx, 1, spacing * 0.5, baseY, 1.0, '#f59e0b', true);
		const info2 = drawMiniStaircase(comparisonCtx, 2, spacing * 1.5, baseY, 1.0, '#10b981', true);

		comparisonCtx.fillStyle = '#1f2937';
		comparisonCtx.font = 'bold 16px Arial';
		comparisonCtx.textAlign = 'center';
		comparisonCtx.fillText('N-1 = 1', info1.centerX, info1.bottomY);
		comparisonCtx.fillStyle = '#667eea';
		comparisonCtx.font = 'bold 20px Arial';
		comparisonCtx.fillText(`${info1.count} ways`, info1.centerX, info1.bottomY + 25);

		comparisonCtx.fillStyle = '#1f2937';
		comparisonCtx.font = 'bold 16px Arial';
		comparisonCtx.fillText('N = 2', info2.centerX, info2.bottomY);
		comparisonCtx.fillStyle = '#667eea';
		comparisonCtx.font = 'bold 20px Arial';
		comparisonCtx.fillText(`${info2.count} ways`, info2.centerX, info2.bottomY + 25);

		comparisonCtx.fillStyle = '#1f2937';
		comparisonCtx.font = 'bold 20px Arial';
		comparisonCtx.textAlign = 'center';
		comparisonCtx.fillText(`${info1.count} + 1 = ${info2.count}`, canvasWidth / 2, 40);

		comparisonCtx.font = '16px Arial';
		comparisonCtx.fillStyle = '#6b7280';
		comparisonCtx.fillText('(N-2 = 0, so we use 1 as the base)', canvasWidth / 2, 65);
	}

	function drawSingleStaircaseComparison() {
		const centerX = comparisonCanvas.width / 2;
		const baseY = comparisonCanvas.height - 100;

		const info = drawMiniStaircase(comparisonCtx, 1, centerX - 40, baseY, 1.0, '#10b981', true);

		comparisonCtx.fillStyle = '#1f2937';
		comparisonCtx.font = 'bold 16px Arial';
		comparisonCtx.textAlign = 'center';
		comparisonCtx.fillText('N = 1', info.centerX, info.bottomY);
		comparisonCtx.fillStyle = '#667eea';
		comparisonCtx.font = 'bold 20px Arial';
		comparisonCtx.fillText(`${info.count} ways`, info.centerX, info.bottomY + 25);

		comparisonCtx.fillStyle = '#6b7280';
		comparisonCtx.font = '18px Arial';
		comparisonCtx.fillText('Base case: Only one way to climb 1 step', centerX, 40);
	}

	function handleStepsChange(event) {
		steps = parseInt(event.target.value);
		currentPathIndex = 0;
		stopAnimation();
	}

	function showNextPath() {
		if (paths.length === 0) return;
		currentPathIndex = (currentPathIndex % paths.length) + 1;
		draw();
	}

	async function animateAllPaths() {
		if (isAnimating) {
			stopAnimation();
			return;
		}

		isAnimating = true;

		for (let i = 1; i <= paths.length; i++) {
			if (!isAnimating) break;

			currentPathIndex = i;
			draw();

			await new Promise((resolve) => setTimeout(resolve, 1000));
		}

		isAnimating = false;
	}

	function stopAnimation() {
		isAnimating = false;
	}

	function reset() {
		currentPathIndex = 0;
		stopAnimation();
		draw();
	}
</script>

<svelte:head>
	<title>Staircase Paths - MathFun</title>
</svelte:head>

<section class="game-section">
	<h1>Staircase Paths</h1>
	<p class="description">
		How many different ways can you climb a staircase with N steps if you can take 1 or 2 steps at
		a time? Explore the Fibonacci sequence through interactive visualization.
	</p>

	<div class="controls-panel">
		<div class="slider-control">
			<label for="steps-slider">Number of Steps: <strong>{steps}</strong></label>
			<input
				type="range"
				id="steps-slider"
				min="1"
				max="10"
				bind:value={steps}
				oninput={handleStepsChange}
			/>
		</div>

		<div class="button-controls">
			<button class="btn" onclick={showNextPath}>Show Next Path</button>
			<button class="btn" onclick={animateAllPaths}>
				{isAnimating ? 'Stop Animation' : 'Animate All Paths'}
			</button>
			<button class="btn btn-secondary" onclick={reset}>Reset</button>
		</div>
	</div>

	<div class="visualization-container">
		<div class="canvas-wrapper">
			<h3>Current Path Visualization</h3>
			<canvas bind:this={canvas} width="700" height="450" class="visualization-canvas"></canvas>
		</div>
	</div>

	<div class="stats">
		<div class="stat-box">
			<h4>Total Ways</h4>
			<p class="stat-value">{paths.length}</p>
		</div>
		<div class="stat-box">
			<h4>Fibonacci Number</h4>
			<p class="stat-value">F({steps + 1}) = {paths.length}</p>
		</div>
		<div class="stat-box wide">
			<h4>Current Path</h4>
			<p class="stat-value">{formatCurrentPath()}</p>
		</div>
	</div>

	<div class="comparison-section">
		<h3>How Paths Combine (Fibonacci Pattern)</h3>
		<canvas
			bind:this={comparisonCanvas}
			width="900"
			height="400"
			class="comparison-canvas"
		></canvas>
	</div>

	{#if paths.length <= 20}
		<div class="paths-list">
			<h3>All Possible Paths ({paths.length})</h3>
			<div class="paths-container">
				{#each paths as path, index}
					<div class="path-item">
						{index + 1}. {path.map((s) => `+${s}`).join(' → ')} = {steps}
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="paths-list">
			<h3>All Possible Paths ({paths.length})</h3>
			<p class="too-many-paths">
				Too many paths to display (>20). Use the animation or step-through to view them.
			</p>
		</div>
	{/if}

	<div class="explanation">
		<h3>The Fibonacci Connection</h3>
		<p>
			This problem demonstrates a fascinating connection to the Fibonacci sequence! The number of
			ways to climb a staircase with N steps follows the Fibonacci pattern because at each step,
			you can either take a 1-step or 2-step move. This means:
		</p>
		<ul>
			<li>To reach step N, you could have come from step N-1 (taking a 1-step)</li>
			<li>Or you could have come from step N-2 (taking a 2-step)</li>
		</ul>
		<p>
			Therefore: <strong>ways(N) = ways(N-1) + ways(N-2)</strong> — exactly the Fibonacci
			formula!
		</p>
		<p style="margin-top: 1rem;">
			The sequence goes: 1, 2, 3, 5, 8, 13, 21, 34, 55, 89... where each number is the sum of the
			two preceding ones.
		</p>
	</div>
</section>

<style>
	.game-section {
		padding: 2rem 0;
	}

	.description {
		color: var(--text-secondary);
		font-size: 1.1rem;
		line-height: 1.6;
		margin-top: 1rem;
		margin-bottom: 2rem;
	}

	.controls-panel {
		background: var(--surface-color);
		border-radius: 12px;
		padding: 2rem;
		margin: 2rem 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.slider-control {
		margin-bottom: 1.5rem;
	}

	.slider-control label {
		display: block;
		margin-bottom: 0.75rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.slider-control input[type='range'] {
		width: 100%;
		height: 8px;
		border-radius: 5px;
		background: linear-gradient(90deg, var(--brand-teal), var(--brand-blue));
		outline: none;
	}

	.slider-control input[type='range']::-webkit-slider-thumb {
		appearance: none;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: white;
		border: 3px solid var(--brand-teal);
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.button-controls {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.visualization-container {
		margin: 2rem 0;
	}

	.canvas-wrapper {
		background: var(--surface-color);
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.canvas-wrapper h3 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.visualization-canvas,
	.comparison-canvas {
		display: block;
		max-width: 100%;
		height: auto;
		border: 2px solid var(--border-color);
		border-radius: 8px;
		background: white;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin: 2rem 0;
	}

	.stat-box {
		background: var(--surface-color);
		border-radius: 12px;
		padding: 1.5rem;
		text-align: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		border: 2px solid var(--border-color);
	}

	.stat-box.wide {
		grid-column: span 2;
	}

	.stat-box h4 {
		margin: 0 0 0.75rem 0;
		color: var(--text-secondary);
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, var(--brand-teal), var(--brand-blue));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 0;
	}

	.comparison-section {
		background: var(--surface-color);
		border-radius: 12px;
		padding: 2rem;
		margin: 2rem 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.comparison-section h3 {
		margin-top: 0;
		margin-bottom: 1.5rem;
	}

	.paths-list {
		background: var(--surface-color);
		border-radius: 12px;
		padding: 2rem;
		margin: 2rem 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.paths-list h3 {
		margin-top: 0;
		margin-bottom: 1.5rem;
	}

	.paths-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 0.75rem;
	}

	.path-item {
		background: linear-gradient(145deg, #f8fafc, #f1f5f9);
		padding: 0.75rem 1rem;
		border-radius: 8px;
		border-left: 3px solid var(--brand-teal);
		font-family: 'Courier New', monospace;
		font-size: 0.9rem;
	}

	.too-many-paths {
		color: var(--text-secondary);
		font-style: italic;
	}

	.explanation {
		background: var(--surface-color);
		border-radius: 12px;
		padding: 2rem;
		margin: 2rem 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.explanation h3 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.explanation p {
		line-height: 1.8;
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}

	.explanation ul {
		line-height: 1.8;
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}

	@media (max-width: 768px) {
		.stat-box.wide {
			grid-column: span 1;
		}

		.button-controls {
			flex-direction: column;
		}

		.button-controls .btn {
			width: 100%;
		}
	}
</style>
