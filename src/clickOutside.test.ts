import * as assert from 'assert';
import * as sinon from 'sinon';
import { clickOutside } from './clickOutside';

describe('clickOutside', function () {
	let element: HTMLElement;
	let sibling: HTMLElement;
	let action: ReturnType<typeof clickOutside>;

	before(function () {
		element = document.createElement('div');
		sibling = document.createElement('div');
		document.body.appendChild(element);
		document.body.appendChild(sibling);
	});

	after(function () {
		element.remove();
		sibling.remove();
	});

	afterEach(function () {
		action.destroy!();
	});

	it('calls callback on outside click', function () {
		const cb = sinon.fake();
		action = clickOutside(element, { enabled: true, cb });

		sibling.click();
		assert.ok(cb.calledOnce);
	});

	it('does not call callback when disabled', function () {
		const cb = sinon.fake();
		action = clickOutside(element, { enabled: false, cb });

		sibling.click();
		assert.ok(cb.notCalled);
	});

	it('does not call callback when element clicked', function () {
		const cb = sinon.fake();
		action = clickOutside(element, { enabled: true, cb });

		element.click();
		assert.ok(cb.notCalled);
	});

	it('updates parameters', function () {
		const cb = sinon.fake();
		action = clickOutside(element, { enabled: true, cb });

		// @ts-expect-error
		action.update!({ enabled: false });
		element.click();
		assert.ok(cb.notCalled);
	});
});
