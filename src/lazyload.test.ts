import * as assert from 'assert';
import * as sinon from 'sinon';
import { lazyload } from './lazyload';

describe('lazyload', function () {
	let element: HTMLElement;
	let action: ReturnType<typeof lazyload>;
	let intersectionObserverConstructorSpy: sinon.SinonSpy;
	const observeFake = sinon.fake();
	const unobserveFake = sinon.fake();

	before(function () {
		setupIntersectionObserverMock({
			observe: observeFake,
			unobserve: unobserveFake,
		});
		intersectionObserverConstructorSpy = sinon.spy(global, 'IntersectionObserver');
	});

	beforeEach(function () {
		element = document.createElement('div');
		document.body.appendChild(element);
	});

	afterEach(function () {
		action.destroy!();
		element.remove();
		observeFake.resetHistory();
		unobserveFake.resetHistory();
	});

	it('observes node', function () {
		action = lazyload(element, {});
		assert.ok(intersectionObserverConstructorSpy.calledOnce);
		assert.ok(observeFake.calledOnce);
	});

	it('sets attribute on intersection', function () {
		action = lazyload(element, { className: 'test' });
		const intersectionCallback = intersectionObserverConstructorSpy.firstCall.firstArg;
		intersectionCallback([
			{
				isIntersecting: true,
				target: element,
			},
		]);

		assert.ok(unobserveFake.calledOnce);
		assert.strictEqual(element.className, 'test');
	});

	it('does not set attribute when no intersection', function () {
		action = lazyload(element, { className: 'test' });
		const intersectionCallback = intersectionObserverConstructorSpy.firstCall.firstArg;
		intersectionCallback([
			{
				isIntersecting: false,
				target: element,
			},
		]);

		assert.ok(unobserveFake.notCalled);
		assert.strictEqual(element.className, '');
	});
});

// from https://stackoverflow.com/a/58651649
function setupIntersectionObserverMock({
	root = null,
	rootMargin = '',
	thresholds = [],
	disconnect = () => null,
	observe = () => null,
	takeRecords = () => [],
	unobserve = () => null,
} = {}): void {
	class MockIntersectionObserver implements IntersectionObserver {
		readonly root: Element | null = root;
		readonly rootMargin: string = rootMargin;
		readonly thresholds: ReadonlyArray<number> = thresholds;
		disconnect: () => void = disconnect;
		observe: (target: Element) => void = observe;
		takeRecords: () => IntersectionObserverEntry[] = takeRecords;
		unobserve: (target: Element) => void = unobserve;
	}

	Object.defineProperty(window, 'IntersectionObserver', {
		writable: true,
		configurable: true,
		value: MockIntersectionObserver,
	});

	Object.defineProperty(global, 'IntersectionObserver', {
		writable: true,
		configurable: true,
		value: MockIntersectionObserver,
	});
}
