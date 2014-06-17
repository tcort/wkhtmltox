wkhtmltox
=========

The goal of this module is to provide high performance access to `wkhtmltopdf` and `wkhtmltoimage` from node.js.
Those two tools are from [wkhtmltopdf](http://wkhtmltopdf.org/), a software package that
provides utilities for rendering HTML into various formats using the QT Webkit rendering engine.

This module is based on an [MIT](http://opensource.org/licenses/MIT) licensed module named [node-wkhtmltopdf](https://github.com/devongovett/node-wkhtmltopdf).

Status
------

Rendering PDFs and images from HTML works. I'm currently working on some changes to make it faster.

Requirements
------------

* [nodejs](http://nodejs.org/) v0.10 or later.
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
    var wkhtmltox = require('../index');
    var converter = new wkhtmltox();
    
    http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'application/pdf'});
        converter.pdf(req, url.parse(req.url, true).query).pipe(res);
    }).listen(1337, '127.0.0.1');
    
    console.log('Server running at http://127.0.0.1:1337/');

Access it with [curl](http://curl.haxx.se/)

    curl -d @test.html -s "http://localhost:1337/?copies=2" -o test.pdf

Contributing
------------

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

Failed Attempts
---------------

For other intrepid adventurers, here are some approaches I tried to make rendering take less time that didn't quite work out:

- native bindings - tried to do native bindings for libwkhtmltox. This had all kinds of issue come up on various platforms. For example, on FreeBSD I was getting a seg fault during webkit's SSL initialization (what?!?!), on Mac OS X I was getting Qt Threading errors when code that used the module was run under mocha, on Linux it worked fine.
- multi-threaded unix domain socket server - tried to push the libwkhtmltox interface out into a server that a node library would connect to through a unix domain socket. This had issues with memory leaks. I don't think Qt/WebKit/libwkhtmltox is a good fit for long running processes.
- multi-process unix domain socket server - tried the same as above but with processes. The issue I ran into was that the libwkhtmltox init function had to be called within the process that did the rendering. If we're going to do fork() and then initialization after, then there isn't much advantage over exec()'ing the wkhtmltopdf binary.
- worker pool using `--read-args-from-stdin` - tried spawning a bunch of `wkhtmltopdf` processes with the `--read-args-from-stdin` option and feeding them work when a rendering was requested. The problem comes when the output is streamed because there are no signals/events for when the job completes (i.e. you can't easily tell if there is more PDF to come or not when streaming the output -- you'd have to look for the %EOF tag in the output stream).
