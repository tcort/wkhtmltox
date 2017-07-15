"use strict";

var _ = require('lodash');
var log = require('tclogger');
var os = require('os');
var slang = require("slang");
var spawn = require("child_process").spawn;

/*
 * Portions of this code are based on MIT licensed code from: https://github.com/devongovett/node-wkhtmltopdf
 */
function wkhtmltox(opts) {

    var self = this;

    // create an instance of wkhtmltox if the user decided not to use 'new'.
    if (!(self instanceof wkhtmltox)) {
        return new wkhtmltox(opts);
    }

    // Apply Default Settings
    self.opts            = _.cloneDeep(opts)    || {};
    self.opts.interval   = self.opts.interval   || 1000;
    if (self.opts.maxWorkers !== 0) {
        self.opts.maxWorkers = self.opts.maxWorkers || os.cpus().length * 1.5;
    }

    // Sanity checks, override requested amount if requested value is too crazy.
    self.opts.maxWorkers = (self.opts.maxWorkers >=   0 && self.opts.maxWorkers <=    32) ? self.opts.maxWorkers :    4;
    self.opts.interval   = (self.opts.interval   >= 100 && self.opts.interval   <= 60000) ? self.opts.interval   : 5000;

    // Executables -- override these if wkhtmltopdf is installed in a strange location (outside your PATH).
    self.wkhtmltopdf = "wkhtmltopdf";
    self.wkhtmltoimage = "wkhtmltoimage";

    // preloaded processes
    self.workers = [];

    // destructor -- when this process exits, kill any preloaded worker processes.
    process.on('exit', function(code) {
        self.opts.maxWorkers = 0; // prevent new workers from being spawned.

        var worker; // kill all existing workers.
        while (self.workers.length > 0) {
            worker = self.workers.shift();
            worker.kill();
        }
    });

    // Every interval, check to see that there are enough workers. If not, spawn some more. 
    function workerMonitor() {
        while (self.workers.length < self.opts.maxWorkers) {
            self.workers.push(launchWorker());
        }
        setTimeout(workerMonitor, self.opts.interval);
    }

    // Start periodic check of worker pool.
    if (self.opts.maxWorkers > 0) {
        process.nextTick(function () {
            workerMonitor();
        });
    }

    // Preload a worker process. It will have wkhtmltopdf loaded, initialized and ready for input when pdf() is called.
    function launchWorker() {
        // using `sh -c ${cmd} | cat` construction because of an issue with stdin/stdout on Linux.
        return spawn("/bin/sh", [ "-c", [ self.wkhtmltopdf, "--quiet", "--read-args-from-stdin" ].join(" ") + "| cat" ]);
    }

    // Given a worker process, stream the arguments and input over stdin and return stdout.
    function performWork(worker, inputStream, options) {

        // initial command line arguments, always include --quiet because the output will be on STDOUT.
        var args  = [ "--quiet" ];

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

        worker.stdin.once('error', function (err) {
            log('ERROR', 'wkhtmltox worker input stream error', err);
        });

        // send the program the arguments
        worker.stdin.write(args.concat(["-","-"]).join(" ") + "\n");

        // send the program the input.
        inputStream.pipe(worker.stdin);

        // return the output stream to the caller.
        return worker.stdout;
    }

    // HTML to PDF
    self.pdf = function pdf(inputStream, options) {
        var worker = self.workers.shift();
        if (!worker) { // worker pool is empty, workerMonitor can't keep up with demand. Launch our own worker.
            worker = launchWorker();
        }
        return performWork(worker, inputStream, options);
    };

    // HTML to Image
    self.image = function image(inputStream, options) {

        // initial command line arguments, always include --quiet because the output will be on STDOUT.
        var args  = [ self.wkhtmltoimage, "--quiet" ];

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
    };

    return self;
}

module.exports = wkhtmltox;
