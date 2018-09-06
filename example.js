var html2unicode = require("html2unicode")

html2unicode
    .html2unicode(
        '<b>bold</b> ' +
        '<i>italics</i> ' +
        '<pre>mono</pre> ' +
        '<var>y</var><sup>2</sup>'
    ).then(x=>console.log(x))
