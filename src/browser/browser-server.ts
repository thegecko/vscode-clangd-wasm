import { createConnection, BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver/browser';
import { LspServer } from '../lsp/lsp-server';

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);
new LspServer(connection);
