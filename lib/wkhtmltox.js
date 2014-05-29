"use strict";

var spawn = require("child_process").spawn;
var slang = require("slang");

function wkhtmltox() {

    /* This function is based on MIT licensed code from: https://github.com/devongovett/node-wkhtmltopdf */ 
    function run(cmd, input, options, callback) {

        if (!options) {
            options = {};
        } else if (typeof options === "function") {
            callback = options;
            options = {};
        }

        var output = options.output;
        delete options.output;

        var args = [ cmd, "--quiet" ];
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

        var child;
        if (process.platform === "win32") {
            child = spawn(args[0], args.slice(1));
        } else {
            child = spawn("/bin/sh", [ "-c", args.join(" ") + " | cat" ]);
        }

        if (callback) {
            child.on("exit", callback);
        }

        if (!isUrl) {
            child.stdin.end(input);
        }

        return child.stdout;
    }

    this.wkhtmltopdf = "wkhtmltopdf";
    this.pdf = function pdf(input, options, callback) {
        return run(this.wkhtmltopdf, input, options, callback);
    };

    this.wkhtmltoimage = "wkhtmltoimage";
    this.image = function image(input, options, callback) {
        return run(this.wkhtmltoimage, input, options, callback);
    };

    return this;
}

module.exports = wkhtmltox;
