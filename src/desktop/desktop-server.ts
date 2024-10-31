import { createConnection, ProposedFeatures } from 'vscode-languageserver/node';
import { LspServer } from '../lsp/lsp-server';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);
new LspServer(connection);
