# wkhtmltox

[![NPM](https://nodei.co/npm/wkhtmltox.png)](https://nodei.co/npm/wkhtmltox/)

[![Build Status](https://api.travis-ci.org/tcort/wkhtmltox.png?branch=master)](http://travis-ci.org/tcort/wkhtmltox)

The goal of this module is to provide high performance access to `wkhtmltopdf` and `wkhtmltoimage` from node.js.

This module is based on an [MIT](http://opensource.org/licenses/MIT) licensed module named [node-wkhtmltopdf](https://github.com/devongovett/node-wkhtmltopdf).

## Status

Current Status: **Under Active Development**

Summary: Rendering PDFs and images from HTML works. I'm currently trying a few different approaches to improve performance.

## Requirements

* [nodejs](http://nodejs.org/)
* [wkhtmltopdf/wkhtmltoimage](http://wkhtmltopdf.org/)

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Failed Attempts

For other intrepid adventurers, here are some approaches I tried that failed:

- native bindings - tried to do native bindings for libwkhtmltox. This had all kinds of issue come up on various platforms. For example, on FreeBSD I was getting a seg fault during webkit's SSL initialization (what?!?!), on Mac OS X I was getting Qt Threading errors when code that used the module was run under mocha, on Linux it worked fine.
- multi-threaded unix domain socket server - tried to push the libwkhtmltox interface out into a server that a node library would connect to through a unix domain socket. This had issues with memory leaks. I don't think Qt/WebKit/libwkhtmltox is a good fit for long running processes.
- multi-process unix domain socket server - tried the same as above but with processes. The issue I ran into was that the libwkhtmltox init function had to be called within the process that did the rendering. If we're going to do fork() and then initialization after, then there isn't much advantage over exec()'ing the wkhtmltopdf binary.
