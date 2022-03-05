import { Action } from './types';

/**
 * Simplest possible way to add a keyboard shortcut to a div or a button.
 * It either calls a callback or clicks on the node it was put on.
 *
 * Demo: https://svelte.dev/repl/acd92c9726634ec7b3d8f5f759824d15
 */

export type ShortcutSetting = {
	control?: boolean;
	shift?: boolean;
	alt?: boolean;

	code: string;
	enabled?: boolean;
	callback?: (node: HTMLElement) => void;
};
export const shortcut: Action<ShortcutSetting> = (node, params) => {
	let handler: ((e: KeyboardEvent) => void) | undefined;

	const removeHandler = () => window.removeEventListener('keydown', handler!);

	const setHandler = (_params: typeof params) => {
		removeHandler();

		handler = (e: KeyboardEvent) => {
			if (
				!_params?.enabled ||
				!!_params.alt != e.altKey ||
				!!_params.shift != e.shiftKey ||
				!!_params.control != (e.ctrlKey || e.metaKey) ||
				_params.code != e.code
			)
				return;

			e.preventDefault();

			_params.callback ? _params.callback(node) : node.click();
		};
		window.addEventListener('keydown', handler);
	};

	setHandler(params);

	return {
		update: setHandler,
		destroy: removeHandler,
	};
};
