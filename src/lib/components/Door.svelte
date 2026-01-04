<script>
	import { scale, fly } from 'svelte/transition';

	let {
		doorNumber,
		isSelected = $bindable(false),
		isOpened = $bindable(false),
		isWinner = $bindable(false),
		isDisabled = $bindable(false),
		onclick
	} = $props();

	const displayNumber = doorNumber + 1;
</script>

<button
	class="door"
	class:selected={isSelected}
	class:opened={isOpened}
	class:winner={isWinner}
	class:loser={isOpened && !isWinner}
	class:disabled={isDisabled}
	disabled={isDisabled}
	on:click={onclick}
	in:scale={{ duration: 300, delay: doorNumber * 100 }}
>
	<div class="door-face">
		{#if isOpened}
			<div class="reveal" in:fly={{ y: -20, duration: 400 }}>
				{#if isWinner}
					<span class="prize">🚗</span>
				{:else}
					<span class="prize">🐐</span>
				{/if}
			</div>
		{:else}
			<span class="door-label">Door {displayNumber}</span>
		{/if}
	</div>
</button>

<style>
	.door {
		width: 160px;
		height: 220px;
		background: linear-gradient(145deg, var(--glass-background), rgba(99, 102, 241, 0.05));
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 2px solid var(--glass-border);
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow:
			0 10px 40px rgba(0, 0, 0, 0.1),
			inset 0 1px 1px rgba(255, 255, 255, 0.3);
		position: relative;
		overflow: hidden;
		font-size: 1rem;
		font-weight: 600;
		perspective: 1000px;
		transform-style: preserve-3d;
	}

	.door::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, var(--indigo-500), var(--teal-500));
		border-radius: 16px 16px 0 0;
		opacity: 0.6;
		transition: opacity 0.3s ease;
	}

	.door:hover:not(.disabled):not(.opened) {
		transform: translateY(-12px) rotateY(-5deg) scale(1.05);
		box-shadow:
			0 20px 60px rgba(99, 102, 241, 0.3),
			inset 0 1px 1px rgba(255, 255, 255, 0.4);
		border-color: var(--indigo-400);
	}

	.door:hover:not(.disabled):not(.opened)::before {
		opacity: 1;
	}

	.door:active:not(.disabled):not(.opened) {
		transform: translateY(-8px) rotateY(-3deg) scale(1.02);
	}

	.door.selected:not(.opened) {
		border-color: var(--indigo-500);
		border-width: 3px;
		background: linear-gradient(145deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05));
		box-shadow:
			0 0 0 4px rgba(99, 102, 241, 0.2),
			0 0 40px rgba(99, 102, 241, 0.4),
			inset 0 1px 1px rgba(255, 255, 255, 0.3);
		animation: selectedPulse 2s ease-in-out infinite;
	}

	.door.opened {
		cursor: default;
	}

	.door.winner {
		background: linear-gradient(145deg, rgba(20, 184, 166, 0.2), rgba(20, 184, 166, 0.05));
		border-color: var(--teal-500);
		border-width: 3px;
		animation: winPulse 1.5s ease-in-out;
		box-shadow:
			0 0 0 6px rgba(20, 184, 166, 0.2),
			0 0 60px rgba(20, 184, 166, 0.6),
			0 20px 60px rgba(20, 184, 166, 0.4);
	}

	.door.loser {
		background: linear-gradient(145deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05));
		border-color: var(--red-400);
		opacity: 0.6;
		box-shadow: 0 10px 30px rgba(239, 68, 68, 0.2);
	}

	.door.disabled {
		opacity: 0.4;
		cursor: not-allowed;
		filter: grayscale(0.5);
	}

	[data-theme="dark"] .door {
		box-shadow:
			0 10px 40px rgba(0, 0, 0, 0.5),
			inset 0 1px 1px rgba(255, 255, 255, 0.1);
	}

	[data-theme="dark"] .door:hover:not(.disabled):not(.opened) {
		box-shadow:
			0 20px 60px rgba(99, 102, 241, 0.5),
			inset 0 1px 1px rgba(255, 255, 255, 0.15);
	}

	.door-face {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.door-label {
		color: var(--text-primary);
		font-weight: 600;
	}

	.reveal {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		animation: celebrate 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.prize {
		font-size: 4rem;
		line-height: 1;
	}

	@keyframes celebrate {
		0% {
			transform: scale(0) rotate(-30deg);
			opacity: 0;
		}
		60% {
			transform: scale(1.3) rotate(10deg);
		}
		100% {
			transform: scale(1) rotate(0deg);
			opacity: 1;
		}
	}

	@keyframes selectedPulse {
		0%,
		100% {
			box-shadow:
				0 0 0 4px rgba(99, 102, 241, 0.2),
				0 0 40px rgba(99, 102, 241, 0.4),
				inset 0 1px 1px rgba(255, 255, 255, 0.3);
		}
		50% {
			box-shadow:
				0 0 0 6px rgba(99, 102, 241, 0.3),
				0 0 60px rgba(99, 102, 241, 0.6),
				inset 0 1px 1px rgba(255, 255, 255, 0.4);
		}
	}

	@keyframes winPulse {
		0% {
			transform: scale(1) rotate(0deg);
		}
		25% {
			transform: scale(1.08) rotate(-2deg);
		}
		50% {
			transform: scale(1.12) rotate(2deg);
		}
		75% {
			transform: scale(1.06) rotate(-1deg);
		}
		100% {
			transform: scale(1) rotate(0deg);
		}
	}

	@media (max-width: 600px) {
		.door {
			width: 100px;
			height: 160px;
		}

		.prize {
			font-size: 3rem;
		}
	}
</style>
