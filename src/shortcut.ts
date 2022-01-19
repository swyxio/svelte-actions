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

  callback?: (node?: HTMLElement) => void;
};
export const shortcut: Action = (node, params: ShortcutSetting | undefined) => {
  let handler: ((e: KeyboardEvent) => void) | undefined;

  const removeHandler = () => window.removeEventListener('keydown', handler!),
    setHandler = (params: ShortcutSetting | undefined) => {
      removeHandler();
      if (!params) return;

      handler = (e: KeyboardEvent) => {
        if (
          (!!params.alt != e.altKey) ||
          (!!params.shift != e.shiftKey) ||
          (!!params.control != (e.ctrlKey || e.metaKey)) ||
          params.code != e.code
        )
          return;

        e.preventDefault();

        params.callback ? params.callback(node) : node.click();
      };
      window.addEventListener('keydown', handler);
    };

  setHandler(params);

  return {
    update: setHandler,
    destroy: removeHandler,
  };
};
