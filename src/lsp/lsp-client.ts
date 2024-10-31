import * as vscode from 'vscode';
import { BaseLanguageClient, LanguageClientOptions } from 'vscode-languageclient';
import { logger } from '../logger';

// export const IntrinsicNotificationType = new NotificationType<Intrinsic[]>('some/intrinsics');

export class LspClient implements vscode.Disposable {
    protected client: BaseLanguageClient | undefined;

    public constructor(protected context: vscode.ExtensionContext, protected clientFactory: (options: LanguageClientOptions) => BaseLanguageClient) {
        context.subscriptions.push(this);
    }

    public async activate() {
        logger.debug('lsp activated');

        const documentSelector = [{ language: 'c' }, { language: 'cpp' }];

        // Options to control the language client
        const clientOptions: LanguageClientOptions = {
            documentSelector,
            synchronize: {},
            initializationOptions: {}
        };

        this.client = this.clientFactory(clientOptions);
        await this.client.start();

        // this.client.sendNotification(IntrinsicNotificationType, intrinsics);
        logger.debug('lsp server is ready');
    }

    public dispose() {
        if (this.client) {
            this.client.stop();
        }
    }
}
