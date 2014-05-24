{
    "targets": [
        {
            "target_name": "node_wkhtmltopdf",
            "sources": [
                "src/node_wkhtmltopdf.cc"
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
