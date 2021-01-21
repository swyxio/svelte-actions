import { clickOutside } from '../src/index';
import * as assert from 'assert';
import * as sinon from 'sinon';

describe('clickOutside', function() {
	let element: HTMLElement;
	let sibling: HTMLElement;

	beforeEach(function() {
		element = document.createElement('div');
		sibling = document.createElement('div');
		document.body.appendChild(element);
		document.body.appendChild(sibling);
	});

	it('calls callback on outside click', function() {
		const cb = sinon.fake();
		clickOutside(element, { enabled: true, cb });

		sibling.click();
		assert.ok(cb.calledOnce);
	});

	it('does not call callback when disabled', function() {
		const cb = sinon.fake();
		clickOutside(element, { enabled: false, cb });

		sibling.click();
		assert.ok(cb.notCalled);
	});

	it('does not call callback when element clicked', function() {
		const cb = sinon.fake();
		clickOutside(element, { enabled: true, cb });

		element.click();
		assert.ok(cb.notCalled);
	});

	it('updates parameters', function() {
		const cb = sinon.fake();
		const action = clickOutside(element, { enabled: true, cb });

		action.update({ enabled: false });
		element.click();
		assert.ok(cb.notCalled);
	});
});
