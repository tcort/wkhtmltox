#ifndef __WKHTMLTOX_H
#define __WKHTMLTOX_H

#include <node.h>

class wkhtmltox : public node::ObjectWrap {

	public:
		static void Init(v8::Handle<v8::Object> exports);

	private:
		explicit wkhtmltox();
		~wkhtmltox();

		// TODO add wkhtmltopdf callbacks (phase, error, warning, etc).

		static v8::Handle<v8::Value> New(const v8::Arguments& args);
		static v8::Handle<v8::Value> toPdf(const v8::Arguments& args);
		static v8::Persistent<v8::Function> constructor;
};

#endif /* __NODEWKHTMLTOPDF_H */
