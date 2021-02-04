import { shortcut } from './shortcut';
import { Action } from './types';
import * as assert from 'assert';
import * as sinon from 'sinon';

describe('shortcut', function() {
	let element: HTMLElement;
	let action: ReturnType<Action>;

	const spaceKeyCode = 'Space';

	before(function() {
		element = document.createElement('div');
		document.body.appendChild(element);
	});

	after(function() {
		element.remove();
	});

	afterEach(function() {
		action.destroy!();
	});

	it('calls callback when callback provided', function() {
		const callback = sinon.fake();
		action = shortcut(element, { code: spaceKeyCode, callback });
		dispatchKeydownEvent({ code: spaceKeyCode });

		assert.ok(callback.calledOnce);
	});

	it('clicks node when callback not provided', function() {
		const callback = sinon.fake();
		action = shortcut(element, { code: spaceKeyCode });
		element.addEventListener('click', callback);
		dispatchKeydownEvent({ code: spaceKeyCode });

		assert.ok(callback.calledOnce);
		element.removeEventListener('click', callback);
	});

	it('does not call callback when different key pressed', function() {
		const callback = sinon.fake();
		action = shortcut(element, { code: spaceKeyCode, callback });
		dispatchKeydownEvent({ code: 'KeyA' });

		assert.ok(callback.notCalled);
	});

	it('handles alt key', function() {
		const callback = sinon.fake();
		action = shortcut(element, { code: spaceKeyCode, callback, alt: true });
		dispatchKeydownEvent({ code: spaceKeyCode, altKey: true });

		assert.ok(callback.calledOnce);
	});

	it('handles shift key', function() {
		const callback = sinon.fake();
		action = shortcut(element, { code: spaceKeyCode, callback, shift: true });
		dispatchKeydownEvent({ code: spaceKeyCode, shiftKey: true });

		assert.ok(callback.calledOnce);
	});

	it('handles ctrl and meta key', function() {
		const callback = sinon.fake();
		action = shortcut(element, { code: spaceKeyCode, callback, control: true });
		dispatchKeydownEvent({ code: spaceKeyCode, ctrlKey: true });
		dispatchKeydownEvent({ code: spaceKeyCode, metaKey: true });

		assert.ok(callback.calledTwice);
	});

	it('updates key code', function() {
		const callback = sinon.fake();
		action = shortcut(element, { code: spaceKeyCode, callback });
		action.update!({ code: 'KeyA', callback });
		dispatchKeydownEvent({ code: 'KeyA' });
		dispatchKeydownEvent({ code: spaceKeyCode });

		assert.ok(callback.calledOnce);
	});	
});

function dispatchKeydownEvent(eventInitDict: KeyboardEventInit) {
	window.dispatchEvent(new window.KeyboardEvent('keydown', eventInitDict));
}
