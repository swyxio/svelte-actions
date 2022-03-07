import { Action } from './types';

export interface ClickOutsideConfig {
	enabled: boolean;
	cb: (node: HTMLElement) => void;
}
/**
 * Call callback when user clicks outside a given element
 *
 * @example
 * ```svelte
 * <div use:clickOutside={{ enabled: open, cb: () => open = false }}>
 * ```
 * Demo: https://svelte.dev/repl/dae848c2157e48ab932106779960f5d5?version=3.19.2
 */
export const clickOutside: Action<ClickOutsideConfig> = (node, config) => {
	function handler(e: MouseEvent) {
		if (!node.contains(e.target as Node)) config.cb(node);
	}

	function set_handler(enabled: boolean) {
		(enabled ? window.addEventListener : window.removeEventListener)('click', handler);
	}
	set_handler(config.enabled);

	return {
		update(params) {
			set_handler((config = params).enabled);
		},
		destroy() {
			set_handler(false);
		},
	};
};
