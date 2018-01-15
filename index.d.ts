/// <reference types="node" />

// more options: https://wkhtmltopdf.org/usage/wkhtmltopdf.txt
// this library use dasherize, so abcAbc => abc-abc
interface Options {
    collate?: true,
    noCollate?: true,
    dpi?: number,
    imageDpi?: number,
    imageQuality?: number,
    lowquality?: true,
    marginBottom?: number,
    marginLeft?: number,
    marginRight?: number,
    marginTop?: number,
    orientation?: 'Landscape' | 'Portrait', // default Landscape
    pageHeight?: number,
    pageSize?: 'A4' | 'Letter' | string,
    noPdfCompression?: true,
    title?: string,
    useXserver?: true,
    outline?: true,
    noOutline?: true,
    outlineDepth?: number,
    background?: true,
    noBackground?: true,
    encoding?: string,
    images?: true,
    noImages?: true,
    enableJavascript?: true,
    disableJavascript?: true,
    javascriptDelay?: number,    // milliseconds
    zoom?: number,

}

export = Wkhtmltox

declare class Wkhtmltox {
    public wkhtmltopdf: string;
    public wkhtmltoimage: string;

    constructor(opts?: {
        interval?: number,
        maxWorkers?: number,
    })

    public pdf(inputStream: NodeJS.ReadableStream, options?: Options & any): NodeJS.ReadableStream

    public image(inputStream: NodeJS.ReadableStream, options?: Options & any): NodeJS.ReadableStream
}