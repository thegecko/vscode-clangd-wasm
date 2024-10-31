import { BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver/browser';
import { LspServer } from '../lsp/lsp-server';

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

new LspServer(messageReader, messageWriter);
