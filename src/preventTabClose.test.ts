import { preventTabClose } from './preventTabClose';
import { Action } from './types';
import * as assert from 'assert';
import * as sinon from 'sinon';

describe('preventTabClose', function() {
	let element: HTMLElement;
	let action: ReturnType<Action>;

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

	it('cancels beforeunload event when enabled', function() {
		action = preventTabClose(element, true);
		const event = new window.Event('beforeunload');
		const preventDefaultSpy = sinon.spy(event, 'preventDefault');
		const returnValSpy = sinon.spy(event, 'returnValue', ['set']);
		window.dispatchEvent(event);

		assert.ok(preventDefaultSpy.calledOnce);
		assert.ok(returnValSpy.set.calledWith(''));
	});

	it('does not cancel beforeunload event when disabled', function() {
		action = preventTabClose(element, false);
		const event = new window.Event('beforeunload');
		const preventDefaultSpy = sinon.spy(event, 'preventDefault');
		window.dispatchEvent(event);

		assert.ok(preventDefaultSpy.notCalled);
	});

	it('updates enabled parameter', function() {
		action = preventTabClose(element, false);
		const event = new window.Event('beforeunload');
		const preventDefaultSpy = sinon.spy(event, 'preventDefault');
		window.dispatchEvent(event);

		assert.ok(preventDefaultSpy.notCalled);

		action.update!(true);
		window.dispatchEvent(event);

		assert.ok(preventDefaultSpy.called);
	});
});
