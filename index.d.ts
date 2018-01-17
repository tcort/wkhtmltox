/// <reference types="node" />

// more options: https://wkhtmltopdf.org/usage/wkhtmltopdf.txt
// this library use dasherize, so abcAbc => abc-abc
// "option: false" equals to not defining option
// never means not implemented
interface Options {
    collate?: boolean,
    noCollate?: boolean,

    dpi?: number,

    grayscale?: boolean,

    imageDpi?: number,
    imageQuality?: number,
    lowquality?: boolean,

    marginBottom?: number,
    marginLeft?: number,
    marginRight?: number,
    marginTop?: number,

    orientation?: "Landscape" | "Portrait", // default "Landscape"

    pageWidth?: number,
    pageSize?: "A4" | "Letter" | string,
    pageHeight?: number,

    noPdfCompression?: boolean,

    title?: string,

    useXserver?: boolean,

    outline?: boolean,
    noOutline?: boolean,
    outlineDepth?: number,

    allow?: never,   // Allow the file or files from the specified
    // folder to be loaded (repeatable)
    // TODO allow repeatable options

    background?: boolean,
    noBackground?: boolean,

    bypassProxyFor?: string,
    cacheDir?: string,

    checkBoxCheckedSvg?: string,
    checkBoxSvg?: string,

    cookie?: never, // TODO allow multiple values
    customHeader?: never,

    customHeaderPropagation?: boolean,
    noCustomHeaderPropagation?: boolean,

    defaultHeader?: boolean,

    encoding?: string,

    disableExternalLinks?: boolean,
    enableExternalLinks?: boolean,
    disableForms?: boolean,
    enableForms?: boolean,
    images?: boolean,
    noImages?: boolean,
    disableInternalLinks?: boolean,
    enableInternalLinks?: boolean,
    enableJavascript?: boolean,
    disableJavascript?: boolean,

    javascriptDelay?: number,    // milliseconds
    keepRelativeLinks?: boolean,

    loadErrorHandling?: "abort" | "ignore" | "skip",        // default abort
    loadMediaErrorHandling?: "abort" | "ignore" | "skip",   // default ignore

    disableLocalFileAccess?: boolean,
    enableLocalFileAccess?: boolean,

    minimumFontSize?: number,

    excludeFromOutline?: boolean,
    includeInOutline?: boolean,

    pageOffset?: number,        // numeration offset

    password?: string,

    post?: never,
    postFile?: never,

    p?: string,
    proxy?: string,

    radiobuttonCheckedSvg?: string,
    radiobuttonSvg?: string,

    runScript?: string,

    disableSmartShrinking?: boolean,
    enableSmartShrinking?: boolean,

    stopSlowScripts?: boolean,
    noStopSlowScripts?: boolean,

    userStyleSheet?: string,

    username?: string,

    viewportSize?: string | number,

    windowStatus?: string,

    zoom?: number,

    output?: string,                    // output path
    format?: "jpg" | "png" | string,    // output format

    [x: string]: any,
}

export = Wkhtmltox

declare class Wkhtmltox {
    public wkhtmltopdf: string;
    public wkhtmltoimage: string;

    constructor(opts?: {
        interval?: number,
        maxWorkers?: number,
    })

    public pdf(inputStream: NodeJS.ReadableStream, options?: Options): NodeJS.ReadableStream

    public image(inputStream: NodeJS.ReadableStream, options?: Options): NodeJS.ReadableStream
}