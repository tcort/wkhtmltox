#include <string.h>

#include <stdbool.h>
#include <stdio.h>
#include <wkhtmltox/pdf.h>

#include <node.h>
#include <node_buffer.h>
#include <v8.h>

#include "NodeWkHtmlToPdf.h"

using namespace v8;

Persistent<Function> NodeWkHtmlToPdf::constructor;

// Placeholder constructor.
NodeWkHtmlToPdf::NodeWkHtmlToPdf() {
}

// Placeholder destructor
NodeWkHtmlToPdf::~NodeWkHtmlToPdf() {
}

void NodeWkHtmlToPdf::Init(Handle<Object> exports) {

	// Prepare constructor template
	Local<FunctionTemplate> tpl = FunctionTemplate::New(New);
	tpl->SetClassName(String::NewSymbol("NodeWkHtmlToPdf"));
	tpl->InstanceTemplate()->SetInternalFieldCount(1);

	// Prototypes
	tpl->PrototypeTemplate()->Set(String::NewSymbol("htmlToPdf"), FunctionTemplate::New(htmlToPdf)->GetFunction());
	constructor = Persistent<Function>::New(tpl->GetFunction());
	exports->Set(String::NewSymbol("NodeWkHtmlToPdf"), constructor);
}

Handle<Value> NodeWkHtmlToPdf::New(const Arguments& args) {

	HandleScope scope;

	if (args.IsConstructCall()) {
		// Invoked with 'new'
		NodeWkHtmlToPdf* obj = new NodeWkHtmlToPdf();
		obj->Wrap(args.This());
		return args.This();
	} else {
		// Invoked without 'new', turn it into a new invocation.
		const int argc = 0;
		Local<Value> argv[argc] = { };
		return scope.Close(constructor->NewInstance(argc, argv));
	}
}

Handle<Value> NodeWkHtmlToPdf::htmlToPdf(const Arguments& args) {

	HandleScope scope;

	int rc = 0;

	// TODO allow a callback to be passed in args, then set it on obj
	// NodeWkHtmlToPdf* obj = ObjectWrap::Unwrap<NodeWkHtmlToPdf>(args.This());

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
	wkhtmltopdf_set_object_setting(os, "page", "http://www.tomcort.com/");
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

	// TODO use the wkhtmltopdf CAPI callbacks to make this function async
	// Return the result
	return scope.Close(actualBuffer);
}
