import type { Action } from './types.js';

export type ShortcutConfig = {
	/**
	 * The code of the key to listen for.
	 * {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code}
	 */
	code: KeyboardEventInit['code'];

	/**
	 * The callback to be called when the shortcut is triggered.
	 */
	callback?: (node: HTMLElement) => void;

	control?: boolean;
	shift?: boolean;
	alt?: boolean;
};

function default_callback(node: HTMLElement) {
	node.click();
}
/**
 * Simplest possible way to add a keyboard shortcut to an element.
 * It either calls a callback or clicks on the node it was put on.
 *
 * @example
 * ```svelte
 * <div use:shortcut={{ code: 'KeyA', callback: () => alert('A') }}>
 * ```
 */
export const shortcut: Action<ShortcutConfig> = (node, config) => {
	function handler(event: KeyboardEvent) {
		const should_ignore = !(
			!!config.alt == event.altKey &&
			!!config.shift == event.shiftKey &&
			!!config.control == (event.ctrlKey || event.metaKey) &&
			config.code == event.code
		);

		if (should_ignore) return;

		event.preventDefault();

		(config.callback || default_callback)(node);
	}

	window.addEventListener('keydown', handler);

	return {
		update(params) {
			config = params;
		},
		destroy() {
			window.removeEventListener('keydown', handler);
		},
	};
};
