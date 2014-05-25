var fs = require('fs');
var expect = require('expect.js');
var NodeWkHtmlToPdf = require('../index');

describe('NodeWkHtmlToPdf', function () {
	it ('should define a method called htmlToPdf()', function () {
		var wkHtmlToPdf = new NodeWkHtmlToPdf();
		var result = wkHtmlToPdf.htmlToPdf();
		fs.writeFileSync('test.pdf', result);
		delete result;
	});
});
