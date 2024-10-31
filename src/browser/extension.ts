import * as vscode from 'vscode';
import { LspClient } from '../lsp/lsp-client';
import { BrowserClient } from './browser-client';

let client: LspClient | undefined;

export const activate = async (context: vscode.ExtensionContext): Promise<void> => {
    console.log('Browser extension activated');
    const browserClient = new BrowserClient(context);
    client = new LspClient(context, browserClient.factory);

    client.activate();
};

export const deactivate = async (): Promise<void> => {
    // Do nothing for now
};
