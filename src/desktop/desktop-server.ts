import { IPCMessageReader, IPCMessageWriter } from 'vscode-languageserver/node';
import { LspServer } from '../lsp/lsp-server';

const messageReader = new IPCMessageReader(process);
const messageWriter = new IPCMessageWriter(process);

new LspServer(messageReader, messageWriter);
