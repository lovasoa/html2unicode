const Saxophone = require('saxophone');

/**
 * Turns an html string into an unicode string.
 *
 * @param {string} html the source html
 * @returns {Promise<String>} an unicode string.
 *
 * @example
 *     await html2unicode("Hello, <b>world</b> !");
 *     // --> "Hello, 𝘄𝗼𝗿𝗹𝗱!"
 **/
function html2unicode(html) {
	const chunks = [];
	const parser = new Saxophone();
	let tags = {
		"i": 0, "em":0,
		"b":0, "strong": 0,
		"pre": 0, "code": 0, "tt": 0, "samp": 0, "kbd": 0,
		"var": 0,
		"sub": 0,
		"sup": 0,
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
		sub: false,
		sup: false,
	};
	parser.on('text', ({ contents }) => {
		state.bold = tags.b>0 || tags.strong>0;
		state.italics = tags.i>0 || tags.em>0;
		state.mono = tags.code>0 || tags.tt>0 || tags.pre>0 || tags.samp>0 || tags.kbd>0;
		state.variable = tags['var']>0;
		state.sub = tags.sub>0;
		state.sup = tags.sup>0;
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
 * Transforms a text according to the given options
 * 
 * @example
 *     transform("world", {bold: true});
 *      // --> "𝘄𝗼𝗿𝗹𝗱"
 *
 * @example
 *     transform("world", {bold: true, italics: true});
 *      // --> "𝙬𝙤𝙧𝙡𝙙"
 *
 * @example
 *     transform("n", {sup: true});
 *      // --> "ⁿ"
 *
 * @example
 *     transform("text", {mono: true});
 *      // --> "𝚝𝚎𝚡𝚝"
 **/
function transform(text, { bold, italics, mono, variable, sub, sup }) {
	text = text.normalize("NFKD");
	if (sub) text = subscript(text);
	else if (sup) text = superscript(text);
	else if (bold && italics) text = boldenAndItalicize(text);
	else if (bold) text = bolden(text);
	else if (italics) text = italicize(text);
	else if (mono) text = monospace(text);
	else if (variable) text = scriptize(text);
	return text;
}

class CharTransform {
	constructor(startLetter, endLetter, startReplacement) {
		this.startCode = startLetter.charCodeAt(0);
		this.endCode = endLetter.charCodeAt(0);
		this.replacementCodes = startReplacement.split('').map(c => c.charCodeAt(0));
	}

	matches(charCode) {
		return charCode >= this.startCode && charCode <= this.endCode;
	}

	transform(charCode, buffer) {
		buffer.push(...this.replacementCodes);
		buffer[buffer.length-1] += charCode - this.startCode;
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

class SingleCharTransform extends CharTransform {
	constructor(origin, transformed) {
		super(origin, origin, transformed);
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
	new DigitTransform('𝟬'), // There are no bold italics digits, use simple bold
];

CharTransform.monospaceTransform = [
	new CapitalLetterTransform('𝙰'),
	new SmallLetterTransform('𝚊'),
	new DigitTransform('𝟶'),
];

CharTransform.scriptizeTransform = [
	new CapitalLetterTransform('𝓐'),
	new SmallLetterTransform('𝓪'),
];

CharTransform.subscriptTransform = [
	new DigitTransform('₀'),
	new SingleCharTransform('a', 'ₐ'),
	new SingleCharTransform('e', 'ₑ'),
	new SingleCharTransform('h', 'ₕ'),
	new SingleCharTransform('i', 'ᵢ'),
	new SingleCharTransform('j', 'ⱼ'),
	new CharTransform('k', 'n', 'ₖ'),
	new SingleCharTransform('o', 'ₒ'),
	new SingleCharTransform('p', 'ₚ'),
	new SingleCharTransform('r', 'ᵣ'),
	new CharTransform('s', 't', 'ₛ'),
	new SingleCharTransform('u', 'ᵤ'),
	new SingleCharTransform('v', 'ᵥ'),
	new SingleCharTransform('x', 'ₓ'),
];

CharTransform.superscriptTransform = [
	new SingleCharTransform('1', '¹'),
	new CharTransform('2', '3', '²'),
	new DigitTransform('⁰'),
	new CharTransform('(', ')', '⁽'),
	new SingleCharTransform('+', '⁺'),
	new SingleCharTransform('-', '⁻'),
	new SingleCharTransform('=', '⁼'),
	new SingleCharTransform('n', 'ⁿ'),
	new SingleCharTransform('i', 'ⁱ'),
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
const scriptize = transformator(CharTransform.scriptizeTransform);
const subscript = transformator(CharTransform.subscriptTransform);
const superscript = transformator(CharTransform.superscriptTransform);

if (typeof module !== "undefined") {
	module.exports = {
		html2unicode, transform, bolden, italicize, boldenAndItalicize, monospace,
		scriptize, subscript, superscript,
	};
}
