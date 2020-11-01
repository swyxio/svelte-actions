type Action = (node: HTMLElement, parameters: any) => {
	update?: (parameters: any) => void,
	destroy?: () => void
}


// export function clickOutside(): ReturnType<Action> {

// }


/**
 * Creates `longpress` event when mousedown above `duration` milliseconds.
 * 
 * Usage:
 * 
 *<button use:longpress={duration}
    on:longpress="{() => pressed = true}"
    on:mouseenter="{() => pressed = false}"
  >press and hold</button>
 *
 * Demo: https://svelte.dev/tutorial/adding-parameters-to-actions
 */
export function longpress(node: HTMLElement, duration: number): ReturnType<Action> {
  let timer: number;
  
  const handleMousedown = () => {
    timer = setTimeout(() => {
      node.dispatchEvent(
        new CustomEvent('longpress')
      );
    }, duration);
  };
  
  const handleMouseup = () => {
    clearTimeout(timer)
  };

  node.addEventListener('mousedown', handleMousedown);
  node.addEventListener('mouseup', handleMouseup);

  return {
    update(newDuration) {
      duration = newDuration;
    },
    destroy() {
      node.removeEventListener('mousedown', handleMousedown);
      node.removeEventListener('mouseup', handleMouseup);
    }
  };
}

/**
 * Creates panStart, panMove, panEnd events so you can drag elements.
 * 
 * Demo: https://svelte.dev/tutorial/actions
 * 
 */
export function pannable(node: HTMLElement): ReturnType<Action> {
	let x: number;
	let y: number;

	function handleMousedown(event: MouseEvent) {
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(new CustomEvent('panstart', {
			detail: { x, y }
		}));

		window.addEventListener('mousemove', handleMousemove);
		window.addEventListener('mouseup', handleMouseup);
	}

	function handleMousemove(event: MouseEvent) {
		const dx = event.clientX - x;
		const dy = event.clientY - y;
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(new CustomEvent('panmove', {
			detail: { x, y, dx, dy }
		}));
	}

	function handleMouseup(event: MouseEvent) {
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(new CustomEvent('panend', {
			detail: { x, y }
		}));

		window.removeEventListener('mousemove', handleMousemove);
		window.removeEventListener('mouseup', handleMouseup);
	}

	node.addEventListener('mousedown', handleMousedown);

	return {
		destroy() {
			node.removeEventListener('mousedown', handleMousedown);
		}
	};
}


/**
 * Attach onto any image to lazy load it
 * 
 * <img use:lazyLoad={{src:"/myimage"}} alt="">
 * 
 * Demo: https://svelte.dev/repl/f12988de576b4bf9b541a2a59eb838f6?version=3.23.2
 * 
 */
export function lazyLoad(node: HTMLElement, attributes: Object): ReturnType<Action> { 
	let intersecting = false;

	const handleIntersection: IntersectionObserverCallback = (entries) => {
		intersecting = entries[0].isIntersecting;
		if (entries[0].intersectionRatio > 0) {
			Object.assign(node, attributes)
		}
		if (intersecting) {
			observer.unobserve(node);
		}
	} 
	const observer = new IntersectionObserver(handleIntersection);
	observer.observe(node);
	return {
		destroy() {
			observer.unobserve(node);
		}
	};
}