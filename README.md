# svelte-actions

prototype svelte actions for inclusion into official actions

See RFC: https://github.com/sveltejs/rfcs/pull/24

do not rely on this library yet!

## Included Actions

### `clickOutside`

to be completed

### `longpress`

`export function longpress(node: HTMLElement, duration: number): ReturnType<Action>`

Creates `longpress` event when mousedown above `duration` milliseconds.

Demo: https://svelte.dev/tutorial/adding-parameters-to-actions

```svelte
<script>
  import {lazyLoad} from 'svelte-actions'
</script>

<img use:lazyLoad={{src:"/myimage"}} alt="">
```

### `pannable`

`export function pannable(node: HTMLElement): ReturnType<Action>`

Creates `panStart`, `panMove`, `panEnd` events so you can drag elements. Demo: https://svelte.dev/tutorial/actions

### `lazyLoad`

`export function lazyLoad(node: HTMLElement, attributes: Object): ReturnType<Action>`

Lazily attach properties to any DOM element when it is in the window. Useful for lazy loading images, and other properties.

Demo: https://svelte.dev/repl/f12988de576b4bf9b541a2a59eb838f6?version=3.23.2

```svelte
<script>
  import {lazyLoad} from 'svelte-actions'
</script>

<img use:lazyLoad={{src:"/myimage"}} alt="">
```


## Actions for Consideration

- `closeOnEscape`/`closeOnScroll`/`closeOnFocusOutside`: https://github.com/sveltejs/rfcs/pull/24#issuecomment-645094235
- `selectTextOnFocus`/`clearTextOnEscape`/`blurOnEscape`/`blurOnEnter`:  
- `viewport`: creates `enterViewport`/`leaveViewport` events https://github.com/sveltejs/rfcs/pull/24#issuecomment-645392769