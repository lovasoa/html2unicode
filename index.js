const Saxophone = require('saxophone');

/**
 * Takes an html string and returns a Promise that resolves to an unicode string.
 **/
function html2unicode(html) {
	const chunks = [];
	const parser = new Saxophone();
	let tags = {
		"i": 0, "b": 0, "em":0, "strong": 0, "pre": 0,
		"code": 0, "tt": 0, "samp": 0, "kbd": 0, "var": 0,
	};
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
		mono: false,
		variable: false,
	};
	parser.on('text', ({ contents }) => {
		state.bold = tags.b>0 || tags.strong>0;
		state.italics = tags.i>0 || tags.em>0;
		state.mono = tags.code>0 || tags.tt>0 || tags.pre>0 || tags.samp>0 || tags.kbd>0;
		state.variable = tags['var']>0;
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
function transform(text, { bold, italics, mono }) {
	if (bold && italics) text = boldenAndItalicize(text);
	else if (bold) text = bolden(text);
	else if (italics) text = italicize(text);
	else if (mono) text = monospace(text);
	return text;
}

class CharTransform {
	constructor(startLetter, endLetter, startReplacement) {
		this.startCode = startLetter.charCodeAt(0);
		this.endCode = endLetter.charCodeAt(0);
		this.surrogate = startReplacement.charCodeAt(0);
		this.index = startReplacement.charCodeAt(1);
	}

	matches(charCode) {
		return charCode >= this.startCode && charCode <= this.endCode;
	}

	transform(charCode, buffer) {
		buffer.push(this.surrogate);
		buffer.push(this.index + charCode - this.startCode);
	}
}

class SmallLetterTransform extends CharTransform {
	constructor(startReplacement) {
		super('a', 'z', startReplacement);
	}
}

class CapitalLetterTransform extends CharTransform {
	constructor(startReplacement) {
		super('A', 'Z', startReplacement);
	}
}

class DigitTransform extends CharTransform {
	constructor(startReplacement) {
		super('0', '9', startReplacement);
	}
}

CharTransform.boldenTransforms = [
	new CapitalLetterTransform('𝗔'),
	new SmallLetterTransform('𝗮'),
	new DigitTransform('𝟬'),
];

CharTransform.italicizeTransform = [
	new CapitalLetterTransform('𝘈'),
	new SmallLetterTransform('𝘢'),
];

CharTransform.boldenAndItalicizeTransform = [
	new CapitalLetterTransform('𝘼'),
	new SmallLetterTransform('𝙖'),
];

CharTransform.monospaceTransform = [
	new CapitalLetterTransform('𝙰'),
	new SmallLetterTransform('𝚊'),
	new DigitTransform('𝟶'),
];

function transformator(transforms) {
	return function transform(text) {
		let codesBuffer = [];
		for(let i=0; i<text.length; i++) {
			let code = text.charCodeAt(i);
			const transform = transforms.find(t => t.matches(code));
			if (transform) transform.transform(code, codesBuffer);
			else codesBuffer.push(code);
		}
		return String.fromCharCode(...codesBuffer);
	};
}

const bolden = transformator(CharTransform.boldenTransforms);
const italicize = transformator(CharTransform.italicizeTransform);
const boldenAndItalicize = transformator(CharTransform.boldenAndItalicizeTransform);
const monospace = transformator(CharTransform.monospaceTransform);

if (typeof module !== "undefined") {
	module.exports = { html2unicode, transform, bolden, italicize, boldenAndItalicize, monospace };
}
