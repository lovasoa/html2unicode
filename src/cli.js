#!/usr/bin/env node

const html2unicode = require("./index.js");
 
async function transformPrint(htmlStr) {
    const result = await html2unicode.html2unicode(htmlStr);
    console.log(result);
}

if (process.argv.length === 3) {
	transformPrint(process.argv[2]);
} else {
	process.stdin.on("data", async (chunk) => {
		const result = await html2unicode.html2unicode(chunk);
		process.stdout.write(result);
	});
}
