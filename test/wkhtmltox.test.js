"use strict";

var fs = require('fs');
var path = require('path');
var expect = require('expect.js');
var wkhtmltox = require('../index');

describe('wkhtmltox', function () {
	this.timeout(10000);
	describe('pdf()', function () {
		it ('should be defined', function () {
			var converter = new wkhtmltox();
			expect(converter).to.have.property('pdf');
		});
		it ('should be a function', function () {
			var converter = new wkhtmltox();
			expect(converter.pdf).to.be.a('function');
		});
		it ('should convert html to pdf', function (done) {
			var converter = new wkhtmltox();
			converter.pdf(fs.readFileSync(path.join(__dirname, 'input', 'kitchen-sink.html')), { pageSize: 'letter' }).pipe(fs.createWriteStream(path.join(__dirname, 'output', 'kitchen-sink.pdf'))).on('finish', done);
		});
	});
	describe('image()', function () {
		it ('should be defined', function () {
			var converter = new wkhtmltox();
			expect(converter).to.have.property('image');
		});
		it ('should be a function', function () {
			var converter = new wkhtmltox();
			expect(converter.image).to.be.a('function');
		});
		it ('should convert html to png', function (done) {
			var converter = new wkhtmltox();
			converter.image(fs.readFileSync(path.join(__dirname, 'input', 'kitchen-sink.html')), { format: 'png' }).pipe(fs.createWriteStream(path.join(__dirname, 'output', 'kitchen-sink.png'))).on('finish', done);
		});
		it ('should convert html to jpg', function (done) {
			var converter = new wkhtmltox();
			converter.image(fs.readFileSync(path.join(__dirname, 'input', 'kitchen-sink.html')), { format: 'jpg' }).pipe(fs.createWriteStream(path.join(__dirname, 'output', 'kitchen-sink.jpg'))).on('finish', done);
		});
	});
});
