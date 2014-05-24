var expect = require('expect.js');
var node_wkhtmltopdf = require('../index');

describe('node-wkhtmltopdf', function () {
	it ('should define a method called hello()', function () {
		var result = node_wkhtmltopdf.hello();
		expect(result).to.be('world');
	});
});
