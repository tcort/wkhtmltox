#ifndef __NODEWKHTMLTOPDF_H
#define __NODEWKHTMLTOPDF_H

#include <node.h>

class NodeWkHtmlToPdf : public node::ObjectWrap {

	public:
		static void Init(v8::Handle<v8::Object> exports);

	private:
		explicit NodeWkHtmlToPdf();
		~NodeWkHtmlToPdf();

		// TODO add wkhtmltopdf callbacks (phase, error, warning, etc).

		static v8::Handle<v8::Value> New(const v8::Arguments& args);
		static v8::Handle<v8::Value> htmlToPdf(const v8::Arguments& args);
		static v8::Persistent<v8::Function> constructor;
};

#endif /* __NODEWKHTMLTOPDF_H */
