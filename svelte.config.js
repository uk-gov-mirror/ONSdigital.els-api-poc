/** @type {import('@sveltejs/kit').Config} */
import adapter_node from '@sveltejs/adapter-node';
import adapter_netlify from '@sveltejs/adapter-netlify';

const adapter = !!process.env.NETLIFY ? adapter_netlify : adapter_node;

const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;