"use strict";

var spawn = require("child_process").spawn;
var slang = require("slang");
var    os = require('os');
var     _ = require('underscore');

/* Portions of this code are based on MIT licensed code from: https://github.com/devongovett/node-wkhtmltopdf */

function wkhtmltox(opts) {

    var self = this;

    var workers = [];

    // Apply Default Settings, handling the case where opts is 'undefined'
    opts = _.extend({maxWorkers: os.cpus().length * 1.5, interval: 1000}, opts);

    // Sanity checks, override requested amount if requested value is too crazy.
    opts.maxWorkers = (opts.maxWorkers >=   0 && opts.maxWorkers <=    32) ? opts.maxWorkers :    4;
    opts.interval   = (opts.interval   >= 100 && opts.interval   <= 60000) ? opts.interval   : 5000;

    // Executables
    self.wkhtmltopdf = "wkhtmltopdf";
    self.wkhtmltoimage = "wkhtmltoimage";

    // Spawn a new worker process
    function launchWorker() {
        return spawn("/bin/sh", [ "-c", [ self.wkhtmltopdf, "--quiet", "--read-args-from-stdin" ].join(" ") + "| cat" ]);
    }

    // Periodically check the number of workers in workers[], if it's below maxWorkers, add more.
    function workerMonitor() {
        while (workers.length < opts.maxWorkers) {
            workers.push(launchWorker());
        }
        setTimeout(workerMonitor, opts.interval);
    }

    // Start periodic check of worker pool.
    if (opts.maxWorkers > 0) {
        workerMonitor();
    }

    // Build up the list of arguments to send
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

    // Use worker to perform a PDF rendering job.
    function performWork(worker, input, options, callback) {
        if (!options) {
            options = {};
        } else if (typeof options === "function") {
            callback = options;
            options = {};
        }

        var args = buildArgs([ "--quiet" ], input, options);
        var isUrl = /^(https?|file):\/\//.test(input);


        worker.stdin.write(args.join(" ") + "\n");

        if (callback) {
            worker.on("exit", callback);
        }

        if (!isUrl) {
            worker.stdin.end(input);
        }

        return worker.stdout;
    }

    // HTML to PDF
    self.pdf = function pdf(input, options, callback) {
        var worker = workers.shift();
        if (!worker) { // worker pool is empty, workerMonitor can't keep up with demand. Launch our own worker.
            worker = launchWorker();
        }
        return performWork(worker, input, options, callback);
    };

    // HTML TO Image
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

    return self;
}

module.exports = wkhtmltox;
