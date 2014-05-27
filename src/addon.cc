#include <string.h>
#include <wkhtmltox/pdf.h>

#include <node.h>
#include <node_buffer.h>

#include <v8.h>

using namespace v8;

Handle<Value> ToPdf(const Arguments& args) {

	HandleScope scope;

	int rc = 0;

	// Output to Buffer Conversion
	const unsigned char *data = NULL;
	long length = 0;
	node::Buffer *slowBuffer;
	Local<Object> globalObj;
	Local<Function> bufferConstructor;
	Handle<Value> constructorArgs[3];
	Local<Object> actualBuffer;

	// HTML to PDF
	wkhtmltopdf_global_settings *gs;
	wkhtmltopdf_object_settings *os;
	wkhtmltopdf_converter *c;

	// Create a container for the global settings.
	gs = wkhtmltopdf_create_global_settings();
	if (gs == NULL) {
		ThrowException(Exception::Error(String::New("NullPointerException")));
		return scope.Close(Undefined());
	}

	// Define global settings.
	// TODO accept these via args: wkhtmltopdf_set_global_setting(gs, "key", "val");

	// Create a converter.
	c = wkhtmltopdf_create_converter(gs);
	if (c == NULL) {
		ThrowException(Exception::Error(String::New("NullPointerException")));
		return scope.Close(Undefined());
	}

	// Create a container for the object settings.
	os = wkhtmltopdf_create_object_settings();
	if (os == NULL) {
		wkhtmltopdf_destroy_converter(c); // Clean-up
		ThrowException(Exception::Error(String::New("NullPointerException")));
		return scope.Close(Undefined());
	}

	// Define object settings.
	// TODO accept these via args
	wkhtmltopdf_set_object_setting(os, "page", "http://www.google.ca/");
	wkhtmltopdf_add_object(c, os, NULL);

	// Perform the conversion.
	rc = wkhtmltopdf_convert(c); // TODO change this to async (begin_conversion).
	if (rc == 0) {
		wkhtmltopdf_destroy_converter(c); // Clean-up
		ThrowException(Exception::Error(String::New("ConversionFailure")));
		return scope.Close(Undefined());
	}

	// Get the output
	length = wkhtmltopdf_get_output(c, &data);
	if (length < 0 || data == NULL) {
		wkhtmltopdf_destroy_converter(c);
		ThrowException(Exception::Error(String::New("OutputFailure")));
		return scope.Close(Undefined());
	}

	// Convert the output to a Buffer
	slowBuffer = node::Buffer::New(length);
	if (slowBuffer == NULL) {
		wkhtmltopdf_destroy_converter(c);
		ThrowException(Exception::Error(String::New("NullPointerException")));
		return scope.Close(Undefined());
	}
	memcpy(node::Buffer::Data(slowBuffer), data, length);

	// Call 'new Buffer(buf, size, 0)'
	globalObj = Context::GetCurrent()->Global();
	bufferConstructor = Local<Function>::Cast(globalObj->Get(String::New("Buffer")));
	constructorArgs[0] = slowBuffer->handle_;
	constructorArgs[1] = v8::Integer::New(length);
	constructorArgs[2] = v8::Integer::New(0);
	actualBuffer = bufferConstructor->NewInstance(3, constructorArgs);

	// Destroy the converter.
	wkhtmltopdf_destroy_converter(c);

	// Return the result
	return scope.Close(actualBuffer);
}

void AtExit(void *arg) {
	wkhtmltopdf_deinit();
}

void AtInit(Handle<Object> exports) {

	wkhtmltopdf_init(false);
	exports->Set(String::NewSymbol("toPdf"), FunctionTemplate::New(ToPdf)->GetFunction());
	node::AtExit(AtExit);
}


NODE_MODULE(addon, AtInit)
