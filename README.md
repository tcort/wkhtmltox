wkhtmltox
=========

The goal of this module is to provide high performance access to `wkhtmltopdf` and `wkhtmltoimage` from node.js.
Those two tools are from [wkhtmltopdf](http://wkhtmltopdf.org/), a software package that
provides utilities for rendering HTML into various formats using the QT Webkit rendering engine.

This module is based on an [MIT](http://opensource.org/licenses/MIT) licensed module named [node-wkhtmltopdf](https://github.com/devongovett/node-wkhtmltopdf).

Requirements
------------

* [nodejs](http://nodejs.org/) v4 or later.
* [wkhtmltopdf/wkhtmltoimage](http://wkhtmltopdf.org/) v0.12 (with patched qt) or later.

Install
-------

The latest and greatest version of this software is available through [npm](http://npmjs.org/).

    npm install wkhtmltox

Examples
--------

**HTML to PDF, JPG, PNG with custom path**

    // include the node module
    var wkhtmltox = require("wkhtmltox");
    
    // instantiate a new converter.
    var converter = new wkhtmltox();
    
    // Locations of the binaries can be specified, but this is
    // only needed if the programs are located outside your PATH
    converter.wkhtmltopdf   = '/opt/local/bin/wkhtmltopdf';
    converter.wkhtmltoimage = '/opt/local/bin/wkhtmltoimage';
    
    // Convert to pdf.
    // Function takes (inputStream, optionsObject), returns outputStream.
    converter.pdf(fs.createReadStream('foo.html'), { pageSize: "letter" })
        .pipe(fs.createWriteStream("foo.pdf"))
        .on("finish", done);
    
    // Convert to image.
    // Function takes (inputStream, optionsObject), returns outputStream.
    converter.image(fs.createReadStream('foo.html'), { format: "jpg" })
        .pipe(fs.createWriteStream("foo.jpg"))
        .on("finish", done);
    
    converter.image(fs.createReadStream('foo.html'), { format: "png" })
        .pipe(fs.createWriteStream("foo.png"))
        .on("finish", done);

**Simple HTML to PDF web service**

Here's a simple web server that converts HTML to PDF. Options can be supplied as query parameters:

    var url = require('url');
    var http = require('http');
    var wkhtmltox = require('wkhtmltox');
    var converter = new wkhtmltox();
    
    http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'application/pdf'});
        converter.pdf(req, url.parse(req.url, true).query).pipe(res);
    }).listen(1337, '127.0.0.1');
    
    console.log('Server running at http://127.0.0.1:1337/');

Access it with [curl](http://curl.haxx.se/)

    curl -d @test.html -s "http://localhost:1337/?copies=2" -o test.pdf

