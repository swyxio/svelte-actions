import * as assert from 'assert';
import * as sinon from 'sinon';
import { longpress } from './longpress';

describe('longpress', function () {
	let element: HTMLElement;
	let cb = sinon.fake();
	let action: ReturnType<typeof longpress>;
	let clock: sinon.SinonFakeTimers;

	before(function () {
		element = document.createElement('div');
		element.addEventListener('longpress', cb);
		document.body.appendChild(element);
		clock = sinon.useFakeTimers();
	});

	after(function () {
		element.remove();
		clock.restore();
	});

	afterEach(function () {
		action.destroy!();
		cb.resetHistory();
	});

	it('dispatches longpress event when mousedown more than duration', function () {
		const duration = 10;
		action = longpress(element, duration);
		element.dispatchEvent(new window.MouseEvent('mousedown'));
		clock.tick(duration);
		element.dispatchEvent(new window.MouseEvent('mouseup'));
		assert.ok(cb.calledOnce);
	});

	it('does not dispatch longpress event when mousedown less than duration', function () {
		action = longpress(element, 100);
		element.dispatchEvent(new window.MouseEvent('mousedown'));
		clock.tick(10);
		element.dispatchEvent(new window.MouseEvent('mouseup'));
		assert.ok(cb.notCalled);
	});

	it('updates duration', function () {
		const newDuration = 10;
		action = longpress(element, 500);
		action.update!(newDuration);

		element.dispatchEvent(new window.MouseEvent('mousedown'));
		clock.tick(newDuration);
		element.dispatchEvent(new window.MouseEvent('mouseup'));
		assert.ok(cb.calledOnce);
	});
});
