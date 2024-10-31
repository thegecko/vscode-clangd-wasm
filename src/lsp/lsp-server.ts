import { TextDocument } from 'vscode-languageserver-textdocument';
import {
    InitializeParams,
    InitializeResult,
    ServerCapabilities,
    TextDocuments,
    TextDocumentIdentifier,
    Connection,
    Hover,
    Position,
    DocumentUri
} from 'vscode-languageserver';

interface Word {
    text: string;
    start: Position;
    end: Position;
}

const FN_REGEX = /[\s()]/;
const MARKDOWN_NEWLINE = '\n\r';
const MARKDOWN_BULLET = ' - ';

export class LspServer {
    // Track open, change and close text document events
    protected documents = new TextDocuments(TextDocument);
    protected words = new Map<DocumentUri, Word[]>();

    public constructor(protected connection: Connection) {
        connection.onInitialize((_params: InitializeParams): InitializeResult => {
            const capabilities: ServerCapabilities = {
                // completionProvider: {},
                // documentLinkProvider: {},
                hoverProvider: {},
                // signatureHelpProvider: {}
            };
            return { capabilities };
        });

        this.documents.onDidOpen(e => this.words.set(e.document.uri, this.getWords(e.document)));
        this.documents.onDidClose(e => this.words.delete(e.document.uri));
        this.documents.onDidChangeContent(e => this.words.set(e.document.uri, this.getWords(e.document)));

        // Register providers
        // connection.onCompletion(params => this.getHoverInformation(params.textDocument, params.position));
        // connection.onCompletionResolve(params => this.getHoverInformation(params.textDocument, params.position));
        // connection.onDocumentLinkResolve(params => this.getHoverInformation(params.textDocument, params.position));
        // connection.onDocumentLinks(params => this.getHoverInformation(params.textDocument, params.position));
        connection.onHover(params => this.getHoverInformation(params.textDocument, params.position));
        // connection.onSignatureHelp(params => this.getHoverInformation(params.textDocument, params.position));

        // connection.onNotification(IntrinsicNotificationType, intrinsics => this.intrinsics = intrinsics);

        // Listen on the connection
        connection.listen();
        this.documents.listen(connection);
    }

    protected getHoverInformation(identifier: TextDocumentIdentifier, position: Position): Hover | undefined {
        const markdown = this.getMarkdown();
        return {
            contents: {
                kind: 'markdown',
                value: markdown
            }
        };
    }

    protected getWords(document: TextDocument): Word[] {
        const words: Word[] = [];
        let word = '';
        let index = 0;
        let start = 0;

        for (const char of document.getText()) {
            index ++;
            if (char.match(FN_REGEX)) {
                if (word !== '') {
                    words.push({
                        text: word,
                        start: document.positionAt(start),
                        end: document.positionAt(index - 1)
                    });
                    word = '';
                }
                start = index;
                continue;
            }
            word += char;
        }

        return words;
    }

    protected getMarkdown(): string {
        const lines = [
            `**Intrinsic**`,
            `**Preparation**`,
            `**Instruction**`,
            `**Result**`,
            `**Architectures**`
        ];
        return lines.join(MARKDOWN_NEWLINE);
    }
}
