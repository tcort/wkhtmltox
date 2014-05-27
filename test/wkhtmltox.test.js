var fs = require('fs');
var expect = require('expect.js');
var wkhtmltox = require('../index');

describe('wkhtmltox', function () {
	it ('should define a method called toPdf()', function () {
		var result = wkhtmltox.toPdf();
		fs.writeFileSync('test.pdf', result);
		delete result;
	});
});
