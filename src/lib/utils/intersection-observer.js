/**
 * Svelte action for intersection observer
 * Dispatches 'inview' event when element enters/exits viewport
 *
 * Usage:
 * <div use:inView on:inview={(e) => console.log('In view:', e.detail)}>
 */
export function inView(node, { threshold = 0.1, rootMargin = '0px' } = {}) {
	const observer = new IntersectionObserver(
		([entry]) => {
			node.dispatchEvent(
				new CustomEvent('inview', { detail: entry.isIntersecting })
			);
		},
		{ threshold, rootMargin }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
