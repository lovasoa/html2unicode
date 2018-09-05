const html2unicode = require('./index.js').html2unicode;
const assert = require('assert');

async function test(html, txt) {
	const res = await html2unicode(html);
	assert.strictEqual(res, txt);
}

test("hello", "hello");
test("<b>hello</b>", "𝗵𝗲𝗹𝗹𝗼");

