import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// Output directory for static files
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		paths: {
			// Set base path for GitHub Pages: https://username.github.io/mathfun
			base: process.argv.includes('dev') ? '' : '/mathfun'
		}
	}
};

export default config;
