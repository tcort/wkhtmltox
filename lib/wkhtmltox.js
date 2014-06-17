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

        // initial command line arguments, always include --quiet because the output will be on STDOUT.
        var args  = [ program, "--quiet" ];

        // for each option that isn't 'in' or 'out', add the flag to args if applicable ...
        _.each(_.omit(options || {}, ['in', 'out']), function flagify(val, key, list) {

            // transform 'someFlag' into '--some-flag'
            key = key.length === 1 ? "-" + key : "--" + slang.dasherize(key);

            // booleans are used to include/exclude no argument flags, as long as not false, include the flag.
            if (val !== false) {
                args.push(key);
            }

            // if this isn't a no argument flag, include the value.
            if (!_.isBoolean(val)) {

		// if this is a string value, quote the value.
                if (_.isString(val)) {
                    val = '"' + val.replace(/(["\\$`])/g, "\\$1") + '"';
                }

                args.push(val);
            }
        });

        // execute the command using the arguments provided.
        // using `sh -c ${cmd} | cat` construction because of an issue with stdin/stdout on Linux.
        var child = spawn("/bin/sh", [ "-c", args.concat(["-","-"]).join(" ") + " | cat" ]);

        // send the program the input.
        inputStream.pipe(child.stdin);

        // return the output stream to the caller.
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
