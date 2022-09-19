import type { Action } from './types.js';

export interface ShortcutConfig {
	/**
	 * Should the event be active or not.
	 * Allows to remove listener when not necessary.
	 */
	active?: boolean;
	alt?: boolean;
	/**
	 * The callback to be called when the shortcut is triggered.
	 */
	callback?: (node: HTMLElement) => void;
	/**
	 * The code of the key to listen for.
	 * {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code}
	 */
	code: KeyboardEventInit['code'];
	control?: boolean;
	shift?: boolean;
}

const callbackFallback = (node: HTMLElement) => node.click();

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
	const validate = (event: KeyboardEvent) => {
		const { alt = false, code, control = false, shift = false } = config;

		return [
			code === event.code,
			alt === event.altKey,
			control == event.ctrlKey || control === event.metaKey,
			shift === event.shiftKey,
		].every(Boolean);
	};

	const handleKeyboard = (event: KeyboardEvent) => {
		if (!validate(event)) {
			return;
		}

		event.preventDefault();
		(config.callback || callbackFallback)(node);
	};

	const activate = () => {
		window.addEventListener('keydown', handleKeyboard);
	};

	const deactivate = () => {
		window.removeEventListener('keydown', handleKeyboard);
	};

	const init = () => {
		const { active = true } = config;
		active
			? activate()
			: deactivate();
	};

	init();

	return {
		update(updatedConfig) {
			config = updatedConfig;
			init();
		},
		destroy() {
			deactivate();
		}
	};
};
