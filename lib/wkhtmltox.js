"use strict";

var spawn = require("child_process").spawn;
var slang = require("slang");
var    os = require('os');
var     _ = require('underscore');

/* Portions of this code are based on MIT licensed code from: https://github.com/devongovett/node-wkhtmltopdf */

function wkhtmltox() {

    var self = this;

    // create an instance of wkhtmltox if the user decided not to use 'new'.
    if (!(self instanceof wkhtmltox)) {
        return new wkhtmltox();
    }

    // Executables -- override these if wkhtmltopdf is installed in a strange location (outside your PATH).
    self.wkhtmltopdf = "wkhtmltopdf";
    self.wkhtmltoimage = "wkhtmltoimage";

    // Private: launch the executable with the given options, pipe inputStream to stdin, and return stdout stream.
    function launch(program, inputStream, options) {

        var args  = [ program, "--quiet" ];
	options = _.omit(options || {}, ['in', 'out']);

        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                var val = options[key];
                key = key.length === 1 ? "-" + key : "--" + slang.dasherize(key);
                if (val !== false) {
                    args.push(key);
                }
                if (typeof val !== "boolean") {
                    if (typeof val === "string") {
                        val = '"' + val.replace(/(["\\$`])/g, "\\$1") + '"';
                    }
                    args.push(val);
                }
            }
        }

        args.push("-"); // stdin
        args.push("-"); // stdout

        var child = spawn("/bin/sh", [ "-c", args.join(" ") + " | cat" ]);
        inputStream.pipe(child.stdin);
        return child.stdout;
    }

    // HTML to PDF
    self.pdf = function pdf(inputStream, options) {
        return launch(self.wkhtmltopdf, inputStream, options);
    };

    // HTML to Image
    self.image = function image(inputStream, options) {
        return launch(self.wkhtmltoimage, inputStream, options);
    };

    return self;
}

module.exports = wkhtmltox;
