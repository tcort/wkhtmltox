var fs = require('fs');
var expect = require('expect.js');
var node_wkhtmltopdf = require('../index');

describe('node-wkhtmltopdf', function () {
	it ('should define a method called htmlToPdf()', function () {
		var result = node_wkhtmltopdf.htmlToPdf();
		fs.writeFileSync('test.pdf', result);
		delete result;
	});
});
