import { Action } from './types';

/**
 * Prevent current tab from being closed by user
 *
 * Demo: https://svelte.dev/repl/a95db12c1b46433baac2817a0963dc93
 *
 * @example
 * ```svelte
 * <div use:preventTabClose={true}>
 * ```
 */
export const preventTabClose: Action<boolean> = (_, enabled: boolean) => {
	function handler(e: BeforeUnloadEvent) {
		e.preventDefault();
		e.returnValue = '';
	}

	function set_handler(shouldWork: boolean) {
		(shouldWork ? window.addEventListener : window.removeEventListener)('beforeunload', handler);
	}

	set_handler(enabled);

	return {
		update: set_handler,
		destroy() {
			set_handler(false);
		},
	};
};
