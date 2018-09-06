const html2unicode = require('../src/index.js').html2unicode;

const assert = require('assert');

async function test(html, txt) {
	const res = await html2unicode(html);
	console.log(`${html}\t⟶\t${res}`);
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
test("<b>по-русский</b>", "по-русский");
test("<b>0123456789</b>", "𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵");

// italics
test("<i>HELLO</i>", "𝘏𝘌𝘓𝘓𝘖");
test("<i>hello</i>", "𝘩𝘦𝘭𝘭𝘰");
test("<em>hello</em>", "𝘩𝘦𝘭𝘭𝘰");
test("<i>0123456789</i>", "0123456789");


// bold and italics combined
test("<i><b>Hello, world!</b></i>", "𝙃𝙚𝙡𝙡𝙤, 𝙬𝙤𝙧𝙡𝙙!");
test("<b>Hello, <i>world</i></b>!", "𝗛𝗲𝗹𝗹𝗼, 𝙬𝙤𝙧𝙡𝙙!");
test("normal <i>italics <b>bolditalics</b></i>", "normal 𝘪𝘵𝘢𝘭𝘪𝘤𝘴 𝙗𝙤𝙡𝙙𝙞𝙩𝙖𝙡𝙞𝙘𝙨");
test("<i><b>0123456789</b></i>", "𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵");

// monospace
test("<pre>Hello, world!</pre>", "𝙷𝚎𝚕𝚕𝚘, 𝚠𝚘𝚛𝚕𝚍!");
test("<code>Hello, world!</code>", "𝙷𝚎𝚕𝚕𝚘, 𝚠𝚘𝚛𝚕𝚍!");
test("<code>Hello, <b>world</b>!</code>", "𝙷𝚎𝚕𝚕𝚘, 𝘄𝗼𝗿𝗹𝗱!");
test("<code>007</code>", "𝟶𝟶𝟽");

// variable
test("<var>hello</var>", "𝓱𝓮𝓵𝓵𝓸");

// subscript
test("<sub>abcdefghijklmnopqrstuvwxyz</sub>", "ₐbcdₑfgₕᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓyz");
test("<sub>0123456789</sub>", "₀₁₂₃₄₅₆₇₈₉");

// superscript
test("<sup>0123456789+-=()ni</sup>", "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿⁱ");

// accents
test("<b>é</b>", "𝗲́");
