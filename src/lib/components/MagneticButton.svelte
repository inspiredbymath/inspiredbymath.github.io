<script>
	import { Motion } from 'svelte-motion';

	let { children, onclick, variant = 'primary', ...rest } = $props();
	let buttonRef;
	let mouseX = $state(0);
	let mouseY = $state(0);

	function handleMouseMove(e) {
		if (!buttonRef) return;
		const rect = buttonRef.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		const deltaX = e.clientX - centerX;
		const deltaY = e.clientY - centerY;
		const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
		const maxDistance = 150;

		if (distance < maxDistance) {
			const strength = (maxDistance - distance) / maxDistance;
			mouseX = deltaX * strength * 0.3;
			mouseY = deltaY * strength * 0.3;
		} else {
			mouseX = 0;
			mouseY = 0;
		}
	}

	function handleMouseLeave() {
		mouseX = 0;
		mouseY = 0;
	}
</script>

<svelte:window on:mousemove={handleMouseMove} />

<Motion
	let:motion
	animate={{ x: mouseX, y: mouseY }}
	transition={{ type: 'spring', stiffness: 200, damping: 20 }}
>
	<button
		bind:this={buttonRef}
		use:motion
		class="magnetic-btn magnetic-btn-{variant}"
		on:click={onclick}
		on:mouseleave={handleMouseLeave}
		{...rest}
	>
		{@render children()}
	</button>
</Motion>

<style>
	.magnetic-btn {
		padding: 0.75rem 2rem;
		border: none;
		border-radius: 12px;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: all 0.3s ease;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.magnetic-btn-primary {
		background: linear-gradient(135deg, var(--indigo-600), var(--indigo-400));
		color: white;
		box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
	}

	.magnetic-btn-primary:hover {
		box-shadow: 0 8px 32px rgba(99, 102, 241, 0.6);
		transform: translateY(-2px) scale(1.02);
	}

	.magnetic-btn-secondary {
		background: var(--glass-background);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		color: var(--color-text-primary);
		border: 1px solid var(--glass-border);
		box-shadow: var(--glass-shadow);
	}

	.magnetic-btn-secondary:hover {
		box-shadow: var(--glow-indigo);
		transform: translateY(-2px) scale(1.02);
	}

	.magnetic-btn:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	[data-theme="dark"] .magnetic-btn-primary {
		background: linear-gradient(135deg, var(--indigo-500), var(--indigo-300));
		box-shadow: 0 4px 16px rgba(99, 102, 241, 0.5);
	}

	[data-theme="dark"] .magnetic-btn-primary:hover {
		box-shadow: 0 8px 32px rgba(99, 102, 241, 0.7);
	}
</style>
