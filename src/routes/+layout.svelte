<script>
	import '../lib/styles/global.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/stores';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { theme } from '$lib/stores/theme';
	import { browser } from '$app/environment';

	let { children } = $props();

	// Apply theme to document
	$effect(() => {
		if (browser) {
			document.documentElement.setAttribute('data-theme', $theme);
		}
	});
</script>

<svelte:head>
	<title>Inspired By Math - Interactive Games and Visualizations</title>
	<meta name="description" content="Explore mathematics through interactive games and simulations" />
</svelte:head>

<Nav />

<div class="container">
	<main>
		{#key $page.url.pathname}
			<div
				in:fly={{ y: 20, duration: 400, delay: 150, easing: cubicOut }}
				out:fade={{ duration: 150 }}
				class="page-transition"
			>
				{@render children()}
			</div>
		{/key}
	</main>
</div>

<Footer />

<style>
	.page-transition {
		min-height: 400px;
	}
</style>
