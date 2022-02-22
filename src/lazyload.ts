import { Action } from './types';

/**
 * Attach onto any image to lazy load it
 *
 * <img use:lazyLoad={{src:"/myimage"}} alt="">
 *
 * Demo: https://svelte.dev/repl/f12988de576b4bf9b541a2a59eb838f6?version=3.23.2
 *
 */
const lazyLoadHandleIntersection: IntersectionObserverCallback = (entries) => {
	entries.forEach((entry) => {
		if (!entry.isIntersecting) {
			return;
		}

		if (!(entry.target instanceof HTMLElement)) {
			return;
		}

		let node = entry.target;
		let attributes = lazyLoadNodeAttributes.find((item) => item.node === node)?.attributes;
		Object.assign(node, attributes);

		lazyLoadObserver.unobserve(node);
	});
};

let lazyLoadObserver: IntersectionObserver;
let lazyLoadNodeAttributes: Array<{ node: HTMLElement; attributes: Object }> = [];

export const lazyload: Action<Object> = (node, attributes) => {
	if (!lazyLoadObserver) {
		lazyLoadObserver = new IntersectionObserver(lazyLoadHandleIntersection);
	}
	lazyLoadNodeAttributes.push({ node, attributes });

	lazyLoadObserver.observe(node);
	return {
		destroy() {
			lazyLoadObserver.unobserve(node);
		},
	};
};
