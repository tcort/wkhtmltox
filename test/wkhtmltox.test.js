"use strict";

var fs = require("fs");
var path = require("path");
var expect = require("expect.js");
var wkhtmltox = require("../index");

describe("wkhtmltox", function() {
    this.timeout(30000);

    var kitchenSinkHtml = fs.readFileSync(path.join(__dirname, "input", "kitchen-sink.html"));
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
            converter.pdf(kitchenSinkHtml, { pageSize: "letter" }).pipe(fs.createWriteStream(path.join(__dirname, "output", "kitchen-sink.pdf"))).on("finish", done);
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
            converter.image(kitchenSinkHtml, { format: "png" }).pipe(fs.createWriteStream(path.join(__dirname, "output", "kitchen-sink.png"))).on("finish", done);
        });
        it("should convert html to jpg", function(done) {
            converter.image(kitchenSinkHtml, { format: "jpg" }).pipe(fs.createWriteStream(path.join(__dirname, "output", "kitchen-sink.jpg"))).on("finish", done);
        });
    });
    describe("version()", function () {
         it("should be defined", function() {
            expect(converter).to.have.property("version");
        });
        it("should be a function", function() {
            expect(converter.version).to.be.a("function");
        });
        it("should retrieve the version string", function(done) {
            converter.version(function versionCallback(err, version) {
                expect(version).not.to.be(null);
                expect(version).not.to.be(undefined);
                expect(version).to.be.an('object');
                expect(version).to.have.property('wkhtmltopdf');
                expect(version).to.have.property('wkhtmltoimage');
                expect(version.wkhtmltopdf).to.be.a('string');
                expect(version.wkhtmltoimage).to.be.a('string');
                expect(version.wkhtmltopdf.indexOf('wkhtmltopdf')).not.to.be(-1);
                expect(version.wkhtmltoimage.indexOf('wkhtmltoimage')).not.to.be(-1);
                expect(version.wkhtmltopdf.indexOf('\n')).to.be(-1);
                expect(version.wkhtmltoimage.indexOf('\n')).to.be(-1);
                done();
            });
        });
    });
});
