import * as manifest from '../manifest';
import { ExtensionContext, Uri } from 'vscode';
import { LanguageClientOptions } from 'vscode-languageclient';
import { LanguageClient } from 'vscode-languageclient/browser';
import { logger } from '../logger';

const WORKER = 'dist/browser-server.js';

export class BrowserClient {
    public constructor(protected context: ExtensionContext) {
        logger.info('Browser client created');
    }

    // this method is called when vs code is activated
    public factory = (clientOptions: LanguageClientOptions) => {
        // Create a worker. The worker main file implements the language server.
        const serverMain = Uri.joinPath(this.context.extensionUri, WORKER);
        const worker = new Worker(serverMain.toString(true));

        // create the language server client to communicate with the server running in the worker
        const client = new LanguageClient(manifest.PACKAGE_NAME, manifest.DISPLAY_NAME, clientOptions, worker);
        return client;
    };
}
