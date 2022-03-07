import { Action } from './types';
const node_attributes_map = new WeakMap<HTMLElement, object>();

const intersection_handler: IntersectionObserverCallback = (entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting && entry.target instanceof HTMLElement) {
			const node = entry.target;
			Object.assign(node, node_attributes_map.get(node));
			lazy_load_observer.unobserve(node);
		}
	});
};

let lazy_load_observer: IntersectionObserver;
function observer() {
	return (lazy_load_observer ??= new IntersectionObserver(intersection_handler));
}
/**
 * Set attributes on an element when it is visible in the viewport.
 *@example
 *```svelte
 * <img use:lazyLoad={{src:"/myimage"}} alt="">
 *```
 * Demo: https://svelte.dev/repl/f12988de576b4bf9b541a2a59eb838f6?version=3.23.2
 *
 */
export const lazyload: Action<object> = (node, attributes) => {
	node_attributes_map.set(node, attributes);
	observer().observe(node);
	return {
		destroy() {
			observer().unobserve(node);
		},
	};
};
