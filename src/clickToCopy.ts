import { Action } from "./types";

/**
 *
 * Copies the text of an element on click: either of the element
 * it's attached to or a different element using the target
 * parameter. Target is a string representing a valid CSS selector.
 *
 * Usage:
 * <p use:clickToCopy> ... </p>
 *
 * or
 *
 * <button use:clickToCopy={'p'}> ... </button>
 *
 * Demo: https://svelte.dev/repl/667d8ac94e2349f3a1b7b8c5fa4c0082?version=3.32.1
 *
 */

export function clickToCopy(node: HTMLElement, target?: string): ReturnType<Action> {
  async function copyText() {
    let text: string = target
      ? (document.querySelector(target) as HTMLElement).innerText
      : node.innerText;

    try {
      await navigator.clipboard.writeText(text);

      node.dispatchEvent(
        new CustomEvent("copysuccess", {
          bubbles: true,
        })
      );
    } catch (error) {
      node.dispatchEvent(
        new CustomEvent("copyerror", {
          bubbles: true,
          detail: error,
        })
      );
    }
  }

  node.addEventListener("click", copyText);

  return {
    destroy() {
      node.removeEventListener("click", copyText);
    },
  };
}
