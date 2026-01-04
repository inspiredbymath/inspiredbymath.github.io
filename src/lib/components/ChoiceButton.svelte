<script>
	let { choice, icon, onSelect, disabled = false } = $props();

	const choiceClass = choice === 'cooperate' ? 'cooperate' : 'defect';
	const label = choice === 'cooperate' ? 'Cooperate' : 'Defect';
</script>

<button class="choice-btn {choiceClass}" on:click={onSelect} {disabled}>
	<span class="icon">{icon}</span>
	<span class="label">{label}</span>
</button>

<style>
	.choice-btn {
		width: 180px;
		height: 180px;
		border: none;
		border-radius: 20px;
		font-size: 1.2rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.15);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		position: relative;
		overflow: hidden;
	}

	.choice-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.2) 50%,
			rgba(255, 255, 255, 0) 100%
		);
		transform: translateX(-100%);
		transition: transform 0.6s;
	}

	.choice-btn:hover::before {
		transform: translateX(100%);
	}

	.choice-btn.cooperate {
		background: linear-gradient(145deg, #34d399, #10b981);
		color: white;
		box-shadow: 0 8px 16px -4px rgba(16, 185, 129, 0.4);
	}

	.choice-btn.cooperate:hover:not(:disabled) {
		background: linear-gradient(145deg, #10b981, #059669);
		transform: translateY(-8px) scale(1.05);
		box-shadow: 0 16px 32px -8px rgba(16, 185, 129, 0.5);
	}

	.choice-btn.cooperate:active:not(:disabled) {
		transform: translateY(-4px) scale(1.02);
		box-shadow: 0 8px 16px -4px rgba(16, 185, 129, 0.4);
	}

	.choice-btn.defect {
		background: linear-gradient(145deg, #f87171, #ef4444);
		color: white;
		box-shadow: 0 8px 16px -4px rgba(239, 68, 68, 0.4);
	}

	.choice-btn.defect:hover:not(:disabled) {
		background: linear-gradient(145deg, #ef4444, #dc2626);
		transform: translateY(-8px) scale(1.05);
		box-shadow: 0 16px 32px -8px rgba(239, 68, 68, 0.5);
	}

	.choice-btn.defect:active:not(:disabled) {
		transform: translateY(-4px) scale(1.02);
		box-shadow: 0 8px 16px -4px rgba(239, 68, 68, 0.4);
	}

	.choice-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.icon {
		font-size: 3.5rem;
		line-height: 1;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
	}

	.label {
		font-size: 1.1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	@media (max-width: 600px) {
		.choice-btn {
			width: 140px;
			height: 140px;
		}

		.icon {
			font-size: 2.5rem;
		}

		.label {
			font-size: 0.9rem;
		}
	}
</style>
