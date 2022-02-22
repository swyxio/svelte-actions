import { Action } from './types';

/**
 * Prevent current tab from being closed by user
 *
 * Demo: https://svelte.dev/repl/a95db12c1b46433baac2817a0963dc93
 */
export const preventTabClose: Action<boolean> = (_, enabled) => {
	const handler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = '';
		},
		setHandler = (shouldWork: boolean) =>
			shouldWork
				? window.addEventListener('beforeunload', handler)
				: window.removeEventListener('beforeunload', handler);

	setHandler(enabled);

	return {
		update: setHandler,
		destroy: () => setHandler(false),
	};
};
