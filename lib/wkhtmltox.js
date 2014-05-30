"use strict";

var spawn = require("child_process").spawn;
var slang = require("slang");
var    os = require('os');

/* Portions of this code are based on MIT licensed code from: https://github.com/devongovett/node-wkhtmltopdf */

// TODO add proper comments ;)
function wkhtmltox() {

    var self = this;

    var workers = []; // TODO on exit should we be cleaning up after ourselves?
    var maxWorkers = os.cpus().length * 1.5; // TODO make this configurable
    var interval = 1000; // check if new workers are needed ever 'interval' ms. TODO make this configurable

    self.wkhtmltopdf = "wkhtmltopdf";
    self.wkhtmltoimage = "wkhtmltoimage";

    function launchWorker() {
        return spawn("/bin/sh", [ "-c", [ self.wkhtmltopdf, "--quiet", "--read-args-from-stdin" ].join(" ") + "| cat" ]);
    }

    function workerMonitor() {
        while (workers.length < maxWorkers) {
            workers.push(launchWorker());
        }
        setTimeout(workerMonitor, interval);
    }
    workerMonitor(); // start worker monitor. TODO make this configurable (maybe disable when interval===0).

    // TODO lots of shared code between performWork() and image(), see if we can de-duplicate some code.
    function performWork(worker, input, options, callback) {
        if (!options) {
            options = {};
        } else if (typeof options === "function") {
            callback = options;
            options = {};
        }

        var output = options.output;
        delete options.output;

        var args = [ "--quiet" ];
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

        worker.stdin.write(args.join(" ") + "\n");

        if (callback) {
            worker.on("exit", callback);
        }

        if (!isUrl) {
            worker.stdin.end(input);
        }

        return worker.stdout;
    }

    self.pdf = function pdf(input, options, callback) {
        var worker = workers.shift();
        if (!worker) { // worker pool is empty, workerMonitor can't keep up with demand. Launch our own worker.
            worker = launchWorker();
        }
        return performWork(worker, input, options, callback);
    };

    self.image = function image(input, options, callback) {
        if (!options) {
            options = {};
        } else if (typeof options === "function") {
            callback = options;
            options = {};
        }

        var output = options.output;
        delete options.output;

        var args = [ self.wkhtmltoimage, "--quiet" ];
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

        var child = spawn("/bin/sh", [ "-c", args.join(" ") + " | cat" ]);

        if (callback) {
            child.on("exit", callback);
        }

        if (!isUrl) {
            child.stdin.end(input);
        }

        return child.stdout;
    };

    return self;
}

module.exports = wkhtmltox;
