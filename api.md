## Functions

<dl>
<dt><a href="#html2unicode">html2unicode(html)</a> ⇒ <code>Promise.&lt;String&gt;</code></dt>
<dd><p>Turns an html string into an unicode string.</p>
</dd>
<dt><a href="#transform">transform()</a></dt>
<dd><p>Transforms a text according to the given options</p>
</dd>
</dl>

<a name="html2unicode"></a>

## html2unicode(html) ⇒ <code>Promise.&lt;String&gt;</code>
Turns an html string into an unicode string.

**Kind**: global function  
**Returns**: <code>Promise.&lt;String&gt;</code> - an unicode string.  

| Param | Type | Description |
| --- | --- | --- |
| html | <code>string</code> | the source html |

**Example**  
```js
await html2unicode("Hello, <b>world</b> !");
    // --> "Hello, 𝘄𝗼𝗿𝗹𝗱!"
```
<a name="transform"></a>

## transform()
Transforms a text according to the given options

**Kind**: global function  
**Example**  
```js
transform("world", {bold: true});
     // --> "𝘄𝗼𝗿𝗹𝗱"
```
**Example**  
```js
transform("world", {bold: true, italics: true});
     // --> "𝙬𝙤𝙧𝙡𝙙"
```
**Example**  
```js
transform("n", {sup: true});
     // --> "ⁿ"
```
**Example**  
```js
transform("text", {mono: true});
     // --> "𝚝𝚎𝚡𝚝"
```
