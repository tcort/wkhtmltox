"use strict";

var fs = require("fs");
var path = require("path");
var expect = require("expect.js");
var wkhtmltox = require("../index");

describe("wkhtmltox", function() {
    this.timeout(30000);

    var kitchenSinkHtml = path.join(__dirname, "input", "kitchen-sink.html");
    var converter = new wkhtmltox();

    before(function() {
        function cleanDir(dirPath) {
            var files;
            try {
                files = fs.readdirSync(dirPath);
            } catch (e) {
                return;
            }
            if (files.length > 0) {
                for (var i = 0; i < files.length; i++) {
                    var filePath = dirPath + "/" + files[i];
                    if (fs.statSync(filePath).isFile() && files[i][0] !== ".") {
                        fs.unlinkSync(filePath);
                    }
                }
            }
        }
        cleanDir(path.join(__dirname, "output"));
    });

    describe("pdf()", function() {
        it("should be defined", function() {
            expect(converter).to.have.property("pdf");
        });
        it("should be a function", function() {
            expect(converter.pdf).to.be.a("function");
        });
        it("should convert html to pdf from HTML string with pipe() output", function(done) {
            converter.pdf(fs.createReadStream(kitchenSinkHtml), { pageSize: "letter" }).pipe(fs.createWriteStream(path.join(__dirname, "output", "kitchen-sink.pdf"))).on("finish", done);
        });
    });

    describe("image()", function() {
        it("should be defined", function() {
            expect(converter).to.have.property("image");
        });
        it("should be a function", function() {
            expect(converter.image).to.be.a("function");
        });
        it("should convert html to png", function(done) {
            converter.image(fs.createReadStream(kitchenSinkHtml), { format: "png" }).pipe(fs.createWriteStream(path.join(__dirname, "output", "kitchen-sink.png"))).on("finish", done);
        });
        it("should convert html to jpg", function(done) {
            converter.image(fs.createReadStream(kitchenSinkHtml), { format: "jpg" }).pipe(fs.createWriteStream(path.join(__dirname, "output", "kitchen-sink.jpg"))).on("finish", done);
        });
    });
});
