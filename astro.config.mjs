// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

/**
 * @astrojs/netlify always turns on Netlify's Vite plugin, which starts a Deno
 * edge-function emulator during `astro dev`. That emulator currently crashes
 * (`unexpected argument '--allow-scripts'`) and Astro reports it as an
 * unhandled rejection. This site has no `netlify/edge-functions`, so skip it.
 */
function disableNetlifyEdgeEmulator() {
	return {
		name: 'disable-netlify-edge-emulator',
		enforce: 'pre',
		async config() {
			const { EdgeFunctionsHandler } = await import('@netlify/edge-functions-dev');
			EdgeFunctionsHandler.prototype.initialize = async function initialize() {
				this.initialized = true;
				return { denoPort: 0, success: false };
			};
		},
	};
}

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: netlify(),
	vite: {
		plugins: [disableNetlifyEdgeEmulator()],
	},
});
