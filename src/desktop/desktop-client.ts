import * as manifest from '../manifest';
import { ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';

const SERVER = 'dist/desktop-server.js';

export class DesktopClient {
    public constructor(protected context: ExtensionContext) {
    }

    // this method is called when vs code is activated
    public factory = (clientOptions: LanguageClientOptions) => {
        // The server is implemented in node
        const serverModule = this.context.asAbsolutePath(SERVER);

        // If the extension is launched in debug mode then the debug server options are used
        // Otherwise the run options are used
        const serverOptions: ServerOptions = {
            run: { module: serverModule, transport: TransportKind.ipc },
            debug: {
                module: serverModule,
                transport: TransportKind.ipc,
            }
        };

        // Create the language client and start the client.
        const client = new LanguageClient(manifest.PACKAGE_NAME, manifest.DISPLAY_NAME, serverOptions, clientOptions);
        return client;
    };
}
