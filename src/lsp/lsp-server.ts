import { MessageReader, MessageWriter } from 'vscode-languageserver';
// import ClangdModule from '@thegecko/clangd-wasm';
import { JsonStream } from './json-stream';

declare const __WASM_SIZE__: string;

const COMPILE_ARGS = [
    '-xc++',
    '-std=c++2b',
    '-pedantic-errors',
    '-Wall'
];

const WORKSPACE_PATH = '/home/web_user';
const FILE_PATH = '/home/web_user/main.cpp';

export class LspServer {
    protected stdinChunks: string[] = [];
    protected currentStdinChunk: (number | null)[] = [];
    protected resolveStdinReady = () => { };
    protected textEncoder = new TextEncoder();
    protected jsonStream = new JsonStream();

    public constructor(reader: MessageReader, protected writer: MessageWriter) {
        reader.listen(data => {
            // non-ASCII characters cause bad Content-Length. Just escape them.
            const body = JSON.stringify(data).replace(/[\u007F-\uFFFF]/g, (ch) => {
                return '\\u' + ch.codePointAt(0)!.toString(16).padStart(4, '0');
            });
            const header = `Content-Length: ${body.length}\r\n`;
            const delimiter = '\r\n';
            this.stdinChunks.push(header, delimiter, body);
            this.resolveStdinReady();
            // console.log('%c%s', 'color: red', `${header}${delimiter}${body}`);
        });

        // this.init();
    }
/*
    protected async init() {
        const wasmBase = `${import.meta.env.BASE_URL}node_modules/@thegecko/clangd-wasm/dist/`;
        const wasmUrl = `${wasmBase}clangd.wasm`;
        const jsModule = import(`${wasmBase}clangd.js`);

        // Pre-fetch wasm, and report progress to main
        const wasmResponse = await fetch(wasmUrl);
        const wasmSize = __WASM_SIZE__;
        const wasmReader = wasmResponse.body!.getReader();
        let receivedLength = 0;
        let chunks: Uint8Array[] = [];
        while (true) {
            const { done, value } = await wasmReader.read();
            if (done) {
                break;
            }
            if (value) {
                chunks.push(value);
                receivedLength += value.length;
                self.postMessage({
                    type: 'progress',
                    value: receivedLength,
                    max: Number(wasmSize),
                });
            }
        }
        const wasmBlob = new Blob(chunks, { type: 'application/wasm' });
        const wasmDataUrl = URL.createObjectURL(wasmBlob);

        const { default: Clangd } = await jsModule;

        // ClangdModule as ModuleFactory
        const clangd = await Clangd({
            thisProgram: '/usr/bin/clangd',
            locateFile: (path: string, prefix: string) => {
                return path.endsWith('.wasm') ? wasmDataUrl : `${prefix}${path}`;
            },
            stdinReady: this.stdinReady,
            stdin: this.stdin.bind(this),
            stdout: this.stdout.bind(this),
            stderr: this.stderr.bind(this),
            onExit: this.onAbort.bind(this),
            onAbort: this.onAbort.bind(this),
        });
        console.log(clangd);

        const flags = [
            ...COMPILE_ARGS,
            '--target=wasm32-wasi',
            '-isystem/usr/include/c++/v1',
            '-isystem/usr/include/wasm32-wasi/c++/v1',
            '-isystem/usr/include',
            '-isystem/usr/include/wasm32-wasi',
        ];

        clangd.FS.writeFile(FILE_PATH, '');
        clangd.FS.writeFile(
            `${WORKSPACE_PATH}/.clangd`,
            JSON.stringify({ CompileFlags: { Add: flags } })
        );

        console.log('%c%s', 'font-size: 2em; color: green', 'clangd started');
        clangd.callMain([]);
        // self.postMessage({ type: 'ready' });

    }
*/
    protected stdin(): number | null {
        if (this.currentStdinChunk.length === 0) {
            if (this.stdinChunks.length === 0) {
                // Should not reach here
                // stdinChunks.push('Content-Length: 0\r\n', '\r\n');
                console.error('Try to fetch exhausted stdin');
                return null;
            }
            const nextChunk = this.stdinChunks.shift()!;
            this.currentStdinChunk.push(...this.textEncoder.encode(nextChunk), null);
        }
        return this.currentStdinChunk.shift()!;
    }

    protected async stdinReady() {
        if (this.stdinChunks.length === 0) {
            return new Promise<void>((r) => (this.resolveStdinReady = r));
        }
    }

    protected stdout(charCode: number) {
        const jsonOrNull = this.jsonStream.insert(charCode);
        if (jsonOrNull !== null) {
            // console.log('%c%s', 'color: green', jsonOrNull);
            this.writer.write(JSON.parse(jsonOrNull));
        }
    }

    protected onAbort = () => {
        this.writer.end();
        // self.reportError('clangd aborted');
    }

    protected stderr(charCode: number) {
    }
}
