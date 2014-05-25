{
    "targets": [
        {
            "target_name": "addon",
            "sources": [
                "src/NodeWkHtmlToPdf.cc",
                "src/addon.cc"
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
