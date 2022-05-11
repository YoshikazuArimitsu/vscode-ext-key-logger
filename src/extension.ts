// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let listener: vscode.Disposable
let channel : vscode.OutputChannel
let startDateTime: number
let lastDateTime: number

export function activate(context: vscode.ExtensionContext) {
	let isLogging: boolean = false
	

	let start = vscode.commands.registerCommand('vscode-ext-key-logger.start', () => {
		lastDateTime = 0
		startDateTime = Date.now()

		if(channel == null) {
			channel = vscode.window.createOutputChannel("keylog")
		}

		isLogging = true
	});

	let stop = vscode.commands.registerCommand('vscode-ext-key-logger.stop', () => {
		isLogging = false
	});

	listener = vscode.workspace.onDidChangeTextDocument(ev => {
		if(!isLogging) return
		if(ev.document.fileName.startsWith("extension-output")) {
			return
		}

		const t = Date.now() - startDateTime

		ev.contentChanges.forEach((cc: vscode.TextDocumentContentChangeEvent) => {
			if(cc.text.length != 1) {
				return
			}
			const line = `${t},${ev.document.fileName},${cc.text}`
			channel.appendLine(line)
		})
	})


	context.subscriptions.push(start);
	context.subscriptions.push(stop);
}

// this method is called when your extension is deactivated
export function deactivate() {}
