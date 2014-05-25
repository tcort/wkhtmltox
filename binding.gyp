{
    "targets": [
        {
            "target_name": "NodeWkHtmlToPdf",
            "sources": [
                "src/NodeWkHtmlToPdf.cc"
            ],
            "libraries": [
                "-lwkhtmltox"
            ],
            "ldflags": [
                "-L/usr/local/lib"
            ],
            "include_dirs": [
                "/usr/local/include"
            ],
            "cflags": [
                "-Wall"
            ]
        }
    ]
}
