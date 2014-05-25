var fs = require('fs');
var expect = require('expect.js');
var WkHtmlToX = require('../index');

describe('WkHtmlToX', function () {
	it ('should define a method called toPdf()', function () {
		var wkHtmlToX = new WkHtmlToX();
		var result = wkHtmlToX.toPdf();
		fs.writeFileSync('test.pdf', result);
		delete result;
	});
});
