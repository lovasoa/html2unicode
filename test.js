const html2unicode = require('./index.js').html2unicode;
const assert = require('assert');

async function test(html, txt) {
	const res = await html2unicode(html);
	assert.strictEqual(res, txt);
}

// bold
test("hello", "hello");
test("<b>hello</b>", "𝗵𝗲𝗹𝗹𝗼");
test("<b>Hello</b>", "𝗛𝗲𝗹𝗹𝗼");
test("he<b>ll</b>o", "he𝗹𝗹o");
test("<b>Hello, world!</b>", "𝗛𝗲𝗹𝗹𝗼, 𝘄𝗼𝗿𝗹𝗱!");
test("<strong>Hello, world!</strong>", "𝗛𝗲𝗹𝗹𝗼, 𝘄𝗼𝗿𝗹𝗱!");
test("<strong>Hello, <b>world<b>!</b></b></strong>", "𝗛𝗲𝗹𝗹𝗼, 𝘄𝗼𝗿𝗹𝗱!");
test("<b>по-русский</b>", "по-русский");
