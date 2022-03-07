import { Action } from './types';

/**
 * Creates panStart, panMove, panEnd events so you can drag elements.
 *
 * Demo: https://svelte.dev/tutorial/actions
 *
 */
export const pannable: Action = (node) => {
	let x: number;
	let y: number;

	function handle_mousedown(event: MouseEvent) {
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(
			new CustomEvent('panstart', {
				detail: { x, y },
			})
		);

		window.addEventListener('mousemove', handle_mousemove);
		window.addEventListener('mouseup', handle_mouseup);
	}

	function handle_mousemove(event: MouseEvent) {
		const dx = event.clientX - x;
		const dy = event.clientY - y;
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(
			new CustomEvent('panmove', {
				detail: { x, y, dx, dy },
			})
		);
	}

	function handle_mouseup(event: MouseEvent) {
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(
			new CustomEvent('panend', {
				detail: { x, y },
			})
		);

		window.removeEventListener('mousemove', handle_mousemove);
		window.removeEventListener('mouseup', handle_mouseup);
	}

	node.addEventListener('mousedown', handle_mousedown);

	return {
		destroy() {
			node.removeEventListener('mousedown', handle_mousedown);
		},
	};
};
