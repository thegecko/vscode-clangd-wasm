import * as vscode from 'vscode';
import { LspClient } from '../lsp/lsp-client';
import { DesktopClient } from './desktop-client';

let client: LspClient | undefined;

export const activate = async (context: vscode.ExtensionContext): Promise<void> => {
    const desktopClient = new DesktopClient(context);
    client = new LspClient(context, desktopClient.factory);

    client.activate();
};

export const deactivate = async (): Promise<void> => {
    // Do nothing for now
};
