import { Action } from './types';

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
