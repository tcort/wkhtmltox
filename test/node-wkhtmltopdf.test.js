var fs = require('fs');
var expect = require('expect.js');
var node_wkhtmltopdf = require('../index');

describe('node-wkhtmltopdf', function () {
	it ('should define a method called convert()', function () {
		var result = node_wkhtmltopdf.convert();
		fs.writeFileSync('test.pdf', result);
		delete result;
	});
});
