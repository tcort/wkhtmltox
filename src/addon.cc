#include <wkhtmltox/pdf.h>
#include <node.h>

#include "NodeWkHtmlToPdf.h"

using namespace v8;

void AtExit(void *arg) {
	wkhtmltopdf_deinit();
}

void AtInit(Handle<Object> exports) {

	wkhtmltopdf_init(false);
	NodeWkHtmlToPdf::Init(exports);
	node::AtExit(AtExit);
}


NODE_MODULE(addon, AtInit)
