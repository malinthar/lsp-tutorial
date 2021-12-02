import * as vscode from 'vscode';
import { extensionInstance } from './core/extension';

export function activate(context: vscode.ExtensionContext) {
	//Set the context of the extension instance
	extensionInstance.setContext(context);
	//Initialize the LS Client extension instance.
	extensionInstance.init().catch((error)=> {
		console.log("Failed to activate Ballerina extension. " + (error));
	})
}

export function deactivate() {}
