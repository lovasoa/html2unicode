const Saxophone = require('saxophone');

/**
 * Takes an html string and returns a Promise that resolves to an unicode string.
 **/
function html2unicode(html) {
	const chunks = [];
	const parser = new Saxophone();
	parser.on('text', ({ contents }) => {
		chunks.push(contents);
	});
	const result = new Promise((resolve, reject) => {
		parser.on('finish', () => {
			resolve(chunks.join(''));
		});
	});
	parser.parse(html);
	return result;
}


if (typeof module !== "undefined") {
	module.exports = { html2unicode };
}
