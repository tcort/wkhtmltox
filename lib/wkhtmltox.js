"use strict";

var spawn = require("child_process").spawn;
var slang = require("slang");
var    os = require('os');
var     _ = require('underscore');

/* Portions of this code are based on MIT licensed code from: https://github.com/devongovett/node-wkhtmltopdf */

function wkhtmltox() {

    var self = this;

    // Executables
    self.wkhtmltopdf = "wkhtmltopdf";
    self.wkhtmltoimage = "wkhtmltoimage";

    // Build up the list of command line arguments
    function buildArgs(args, input, options) {
        if (!options) {
            options = {};
        }

        var output = options.output;
        delete options.output;

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

        var isUrl = /^(https?|file):\/\//.test(input);

        args.push(isUrl ? input : "-");
        args.push(output || "-");

        return args;
    }

    // HTML to PDF
    self.pdf = function pdf(input, options, callback) {
        if (!options) {
            options = {};
        } else if (typeof options === "function") {
            callback = options;
            options = {};
        }

        var args  = buildArgs([ self.wkhtmltopdf, "--quiet" ], input, options);
        var isUrl = /^(https?|file):\/\//.test(input);
        var child = spawn("/bin/sh", [ "-c", args.join(" ") + " | cat" ]);

        if (callback) {
            child.on("exit", callback);
        }

        if (!isUrl) {
            child.stdin.end(input);
        }

        return child.stdout;
    };

    // HTML to Image
    self.image = function image(input, options, callback) {
        if (!options) {
            options = {};
        } else if (typeof options === "function") {
            callback = options;
            options = {};
        }

        var args  = buildArgs([ self.wkhtmltoimage, "--quiet" ], input, options);
        var isUrl = /^(https?|file):\/\//.test(input);
        var child = spawn("/bin/sh", [ "-c", args.join(" ") + " | cat" ]);

        if (callback) {
            child.on("exit", callback);
        }

        if (!isUrl) {
            child.stdin.end(input);
        }

        return child.stdout;
    };

    function getVersion(exe, callback) {
        var args  = [ exe, "-V" ];
        var child = spawn("/bin/sh", [ "-c", args.join(" ") + " | cat" ]);
        var versionString = '';

        child.stdout.on('data', function(chunk) {
            versionString += chunk;
        });

        child.stdout.on('end', function () {
            callback(null, versionString.trim());
        });

        child.stdout.on('error', function(err) {
            callback(err, null);
        });
    }

    this.version = function version(callback) {
        getVersion(self.wkhtmltopdf, function (err, wkhtmltopdfVersion) {
            if (err) {
                callback(err, null);
                return;
            }
            getVersion(self.wkhtmltoimage, function (err, wkhtmltoimageVersion) {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, { wkhtmltopdf: wkhtmltopdfVersion, wkhtmltoimage: wkhtmltoimageVersion });
            });
        });
    };

    return self;
}

module.exports = wkhtmltox;
