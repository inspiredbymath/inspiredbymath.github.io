import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createThemeStore() {
	const stored = browser ? localStorage.getItem('theme') : null;
	const initial = stored ||
		(browser && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

	const { subscribe, set, update } = writable(initial);

	return {
		subscribe,
		toggle: () => update(current => {
			const next = current === 'light' ? 'dark' : 'light';
			if (browser) localStorage.setItem('theme', next);
			return next;
		}),
		set: (value) => {
			if (browser) localStorage.setItem('theme', value);
			set(value);
		}
	};
}

export const theme = createThemeStore();
