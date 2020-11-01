# svelte-actions

prototype svelte actions for inclusion into official actions

See RFC: https://github.com/sveltejs/rfcs/pull/24

do not rely on this library yet!

## Install Instructions

```bash
npm i svelte-actions
```

Available actions:

- `clickOutside`
- `longpress`
- `pannable`
- `lazyload`

## Discuss High Level Policy

https://github.com/sw-yx/svelte-actions/issues/7

## Included Actions

### `clickOutside`

`export function clickOutside(node: HTMLElement, params: {enabled: boolean, cb: Function }): ReturnType<Action>`

Call callback when user clicks outside a given element.

Demo: https://svelte.dev/repl/dae848c2157e48ab932106779960f5d5?version=3.19.2


```svelte
<script>
  import {clickOutside} from 'svelte-actions'
  let open = true;
</script>


<div use:clickOutside={{ enabled: open, cb: () => open = false }}>
   <button on:click={() => open = true}>Open</button>
   {#if open}
    <span>
      Opened
    </span>
  {/if}
</div>
```

Discuss this action: https://github.com/sw-yx/svelte-actions/issues/4

### `longpress`

`export function longpress(node: HTMLElement, duration: number): ReturnType<Action>`

Creates `longpress` event when mousedown above `duration` milliseconds.

Demo: https://svelte.dev/tutorial/adding-parameters-to-actions

```svelte
<script>
  import {longpress} from 'svelte-actions'
</script>

<button use:longpress={duration}
    on:longpress="{() => pressed = true}"
    on:mouseenter="{() => pressed = false}"
  >press and hold</button>
```

Discuss this action: https://github.com/sw-yx/svelte-actions/issues/3

### `pannable`

`export function pannable(node: HTMLElement): ReturnType<Action>`

Creates `panstart`, `panmove`, `panend` events so you can drag elements. 

Demo: https://svelte.dev/tutorial/actions

```svelte
<div class="box"
	use:pannable
	on:panstart={handlePanStart}
	on:panmove={handlePanMove}
	on:panend={handlePanEnd}
></div>
```


Discuss this action: https://github.com/sw-yx/svelte-actions/issues/6

### `lazyload`

`export function lazyLoad(node: HTMLElement, attributes: Object): ReturnType<Action>`

Lazily attach properties to any DOM element when it is in the window. Useful for lazy loading images, and other properties.

Demo: https://svelte.dev/repl/f12988de576b4bf9b541a2a59eb838f6?version=3.23.2

```svelte
<script>
  import {lazyload} from 'svelte-actions'
</script>

<img use:lazyLoad={{src:"/myimage"}} alt="">
```

Discuss this action: https://github.com/sw-yx/svelte-actions/issues/2


## Future actions considering adding

- `closeOnEscape`/`closeOnScroll`/`closeOnFocusOutside`: https://github.com/sveltejs/rfcs/pull/24#issuecomment-645094235
- `selectTextOnFocus`/`clearTextOnEscape`/`blurOnEscape`/`blurOnEnter`:  
- `viewport`: creates `enterViewport`/`leaveViewport` events https://github.com/sveltejs/rfcs/pull/24#issuecomment-645392769
- [Propose a new action here!](https://github.com/sw-yx/svelte-actions/issues/new)