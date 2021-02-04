import { pannable } from './pannable';
import { Action } from './types';
import * as assert from 'assert';
import * as sinon from 'sinon';

describe('pannable', function() {
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

	it('dispatches pan events', function() {
		action = pannable(element);
		const panstartCb = sinon.spy();
		const panmoveCb = sinon.spy();
		const panendCb = sinon.spy();
		element.addEventListener('panstart', panstartCb);
		element.addEventListener('panmove', panmoveCb);
		element.addEventListener('panend', panendCb);

		element.dispatchEvent(new window.MouseEvent('mousedown', { clientX: 20, clientY: 30}));
		const panstartDetail = panstartCb.firstCall.firstArg.detail;
		assert.deepStrictEqual(panstartDetail, { x: 20, y: 30 });

		window.dispatchEvent(new window.MouseEvent('mousemove', { clientX: 30, clientY: 50 }));
		const panmoveDetail = panmoveCb.firstCall.firstArg.detail;
		assert.deepStrictEqual(panmoveDetail, { x: 30, y: 50, dx: 10, dy: 20 });

		window.dispatchEvent(new window.MouseEvent('mouseup', { clientX: 35, clientY: 55 }));
		const panendDetail = panendCb.firstCall.firstArg.detail;
		assert.deepStrictEqual(panendDetail, { x: 35, y: 55 });
	});
});
