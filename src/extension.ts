// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { appendFile } from 'fs'

let listener: vscode.Disposable
let channel : vscode.OutputChannel
let startDateTime: number
let lastDateTime: number
let prevChar: string = ""
let outFile: string | undefined

export function activate(context: vscode.ExtensionContext) {
	let isLogging: boolean = false

	const startLogging = () => {
		const configuration = vscode.workspace.getConfiguration('vscode-ext-key-logger');
		outFile = configuration.get<string | undefined>("outFile")
	
		lastDateTime = 0
		startDateTime = Date.now()

		if(channel == null) {
			channel = vscode.window.createOutputChannel("keylog")
		}

		isLogging = true
	}

	let start = vscode.commands.registerCommand('vscode-ext-key-logger.start', () => {
		startLogging()
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
			const c = cc.text.replace("\n", "\\n").replace("\t", "\\t")
			const line = `${t},${t - lastDateTime},${ev.document.fileName},${prevChar},${c}`

			lastDateTime = t
			prevChar = c

			if(outFile) {
				appendFile(outFile, line + "\n", (err) => {
					console.error(err)
				})
			}
			channel.appendLine(line)
		})
	})


	context.subscriptions.push(start);
	context.subscriptions.push(stop);
	startLogging()
}

// this method is called when your extension is deactivated
export function deactivate() {}
