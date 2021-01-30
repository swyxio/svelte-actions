import * as jsdom from 'jsdom';

const window = new jsdom.JSDOM('<main></main>').window;
global.document = window.document;
global.window = window;

require('./clickOutside.test');
