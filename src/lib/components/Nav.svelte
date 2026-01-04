<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let scrolled = $state(false);

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 20;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<nav class="nav-bar" class:scrolled>
	<div class="nav-container">
		<a href={`${base}/`} class="nav-logo">Inspired By Math</a>
		<div class="nav-links">
			<a
				href={`${base}/blog`}
				class="nav-link"
				class:active={$page.url.pathname.startsWith(`${base}/blog`)}
			>
				Journal
			</a>
			<a
				href={`${base}/simulations`}
				class="nav-link"
				class:active={$page.url.pathname.startsWith(`${base}/simulations`) ||
					$page.url.pathname.includes('/monty-hall') ||
					$page.url.pathname.includes('/prisoners-dilemma') ||
					$page.url.pathname.includes('/staircase')}
			>
				Simulations
			</a>
			<ThemeToggle />
		</div>
	</div>
</nav>
