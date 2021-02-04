import * as jsdom from 'jsdom';

const window = new jsdom.JSDOM('<main></main>').window;
global.document = window.document;
global.window = window;
global.CustomEvent = window.CustomEvent;
global.HTMLElement = window.HTMLElement;

require('./clickOutside.test');
require('./lazyload.test');
require('./longpress.test');
require('./pannable.test');
require('./preventTabClose.test');
require('./shortcut.test');
