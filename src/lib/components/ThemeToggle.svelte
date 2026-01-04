<script>
	import { theme } from '$lib/stores/theme';
	import { Sun, Moon } from 'lucide-svelte';
	import { Motion } from 'svelte-motion';
</script>

<Motion
	let:motion
	animate={{ rotate: $theme === 'dark' ? 180 : 0 }}
	transition={{ duration: 0.5 }}
>
	<button
		use:motion
		class="theme-toggle glass"
		on:click={() => theme.toggle()}
		aria-label="Toggle theme"
	>
		{#if $theme === 'light'}
			<Moon size={20} />
		{:else}
			<Sun size={20} />
		{/if}
	</button>
</Motion>

<style>
	.theme-toggle {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		border: 1px solid var(--glass-border);
		background: var(--glass-background);
		backdrop-filter: blur(var(--glass-blur));
		-webkit-backdrop-filter: blur(var(--glass-blur));
		color: var(--color-text-primary);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}

	.theme-toggle:hover {
		transform: scale(1.1);
		box-shadow: var(--glow-indigo);
	}

	.theme-toggle:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}
</style>
