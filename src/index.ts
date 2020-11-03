type Action = (node: HTMLElement, parameters: any) => {
	update?: (parameters: any) => void,
	destroy?: () => void
}

/**
 * 
 * Call callback when user clicks outside a given element
 * 
 * Usage:
 * <div use:clickOutside={{ enabled: open, cb: () => open = false }}>
 * 
 * Demo: https://svelte.dev/repl/dae848c2157e48ab932106779960f5d5?version=3.19.2
 * 
 */
export function clickOutside(node: HTMLElement, params: {enabled: boolean, cb: Function }): ReturnType<Action> {
  const { enabled: initialEnabled, cb } = params

    const handleOutsideClick = ({ target }: MouseEvent) => {
      if (!node.contains(target as Node)) cb(); // typescript hack, not sure how to solve without asserting as Node
    };

    function update({enabled}: {enabled: boolean}) {
      if (enabled) {
        window.addEventListener('click', handleOutsideClick);
      } else {
        window.removeEventListener('click', handleOutsideClick);
      }
    }
    update({ enabled: initialEnabled });
    return {
      update,
      destroy() {
        window.removeEventListener( 'click', handleOutsideClick );
      }
    };

}


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
const lazyLoadHandleIntersection: IntersectionObserverCallback = (entries) => {
	entries.forEach(
		entry => {
			if (!entry.isIntersecting) {
				return
			}

			if (!(entry.target instanceof HTMLElement)) {
				return;
			}

			let node = entry.target;
			let attributes = lazyLoadNodeAttributes.find(item => item.node === node)?.attributes
			Object.assign(node, attributes)

			lazyLoadObserver.unobserve(node)
		}
	)
}
const lazyLoadObserver = new IntersectionObserver(lazyLoadHandleIntersection);
let lazyLoadNodeAttributes: Array<{node: HTMLElement, attributes: Object}> = []
export function lazyload(node: HTMLElement, attributes: Object): ReturnType<Action> {
	lazyLoadNodeAttributes.push({node, attributes})

	lazyLoadObserver.observe(node);
	return {
		destroy() {
			lazyLoadObserver.unobserve(node);
		}
	};
}