#include <wkhtmltox/pdf.h>

#include <node.h>
#include <v8.h>

using namespace v8;

Handle<Value> Convert(const Arguments& args) {
	HandleScope scope;
	return scope.Close(String::New("world"));
}

void init(Handle<Object> exports) {
	exports->Set(String::NewSymbol("convert"), FunctionTemplate::New(Convert)->GetFunction());
}

NODE_MODULE(node_wkhtmltopdf, init)
