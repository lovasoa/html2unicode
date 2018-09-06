const Saxophone = require('saxophone');

/**
 * Takes an html string and returns a Promise that resolves to an unicode string.
 **/
function html2unicode(html) {
	const chunks = [];
	const parser = new Saxophone();
	let tags = {"i": 0, "b": 0, "em":0, "strong": 0};
	parser.on('tagopen', ({ name, attrs, isSelfClosing }) => {
		if (!isSelfClosing && tags.hasOwnProperty(name)) {
			tags[name]++;
		}
	});
	parser.on('tagclose', ({ name }) => {
		if (tags.hasOwnProperty(name)) {
			tags[name]--;
		}
	});
	const state = {
		bold: false,
		italics: false,
	};
	parser.on('text', ({ contents }) => {
		state.bold = (tags.b || tags.strong) > 0;
		state.italics = (tags.i || tags.em) > 0;
		chunks.push(transform(contents, state));
	});
	const result = new Promise((resolve, reject) => {
		parser.on('finish', () => {
			resolve(chunks.join(''));
		});
	});
	parser.parse(html);
	return result;
}

/**
 * Transform a text into italics or bold
 **/
function transform(text, {bold, italics}) {
	if (bold) text = bolden(text);
	return text;
}

let charCodes = {};
for(let l of ['a','z','A','Z','0','9']) {
	charCodes[l] = l.charCodeAt(0);
}

function isCapitalLetter(code) {
	return code >= charCodes.A && code <= charCodes.Z;
}

function isSmallLetter(code) {
	return code >= charCodes.a && code <= charCodes.z;
}

function bolden(text) {
	let codes = [];
	for(let i=0; i<text.length; i++) {
		let code = text.charCodeAt(i);
		if (isCapitalLetter(code)) {
			codes.push(0xD835);
			codes.push(0xDDD4 + code - charCodes.A);
		} else if (isSmallLetter(code)) {
			codes.push(0xD835);
			codes.push(0xDDEE + code - charCodes.a);
		} else {
			codes.push(code);
		}
	}
	return String.fromCharCode(...codes);
}

if (typeof module !== "undefined") {
	module.exports = { html2unicode, transform, bolden };
}
