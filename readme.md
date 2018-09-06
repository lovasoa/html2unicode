# html2unicode

Converts html strings into unicode strings that use
special unicode characters to simulate rich text.

It turns `Hello, <b>world</b>!` into `Hello, 𝘄𝗼𝗿𝗹𝗱!`.

## Try it from your browser

You can [try this library online](https://npm.runkit.com/html2unicode).

## Examples

| html | html2unicode(html) |
|------|--------------------|
|`<b>Hello</b>` | 𝗛𝗲𝗹𝗹𝗼|
|`<strong>Hello, world!</strong>` | 𝗛𝗲𝗹𝗹𝗼, 𝘄𝗼𝗿𝗹𝗱!|
|`<em>hello</em>` | 𝘩𝘦𝘭𝘭𝘰|
|`normal <i>italics <b>bolditalics</b></i>` | normal 𝘪𝘵𝘢𝘭𝘪𝘤𝘴 𝙗𝙤𝙡𝙙𝙞𝙩𝙖𝙡𝙞𝙘𝙨|
|`<i><b>0123456789</b></i>` | 𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵|
|`<pre>Hello, world!</pre>` | 𝙷𝚎𝚕𝚕𝚘, 𝚠𝚘𝚛𝚕𝚍!|
|`<code>Hello, world!</code>` | 𝙷𝚎𝚕𝚕𝚘, 𝚠𝚘𝚛𝚕𝚍!|
|`<code>Hello, <b>world</b>!</code>` | 𝙷𝚎𝚕𝚕𝚘, 𝘄𝗼𝗿𝗹𝗱!|
|`<samp>007</samp>` | 𝟶𝟶𝟽|
|`<var>hello</var>` | 𝓱𝓮𝓵𝓵𝓸|
|`x<sub>2</sub>` | x₂|
|`x<sup>(n+1)</sup>` | x⁽ⁿ⁺¹⁾ |

## API

See [the full documentation](api.md).

### Using ES6

```js
const html2unicode = require("html2unicode");

async function test() {
	const htmlStr = "<b>Hello, <i>world</i></b>!";
	const result = await html2unicode.html2unicode(htmlStr);
	console.log(result);
}

test() // This will display "𝗛𝗲𝗹𝗹𝗼, 𝙬𝙤𝙧𝙡𝙙!";
```

### Using old-style promise chaining

```js
var html2unicode = require("html2unicode");

var htmlStr = "<b>Hello, <i>world</i></b>!";

html2unicode
	.html2unicode(htmlStr)
	.then(function(str) {
		console.log(str);
		// This will display "𝗛𝗲𝗹𝗹𝗼, 𝙬𝙤𝙧𝙡𝙙!";
	});
```

## CLI

This package offers a command-line interface.

```bash
$ npx html2unicode '<b>bold</b>'
𝗯𝗼𝗹𝗱
```
