// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { FileDataProvider } from './FileDataProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const fileDataProvider = new FileDataProvider();
    vscode.window.registerTreeDataProvider('sidebarDemoView', fileDataProvider);

	const openFileCommand = vscode.commands.registerCommand('sidebar-demo.openFile', (fullPath: string) => {
		const fileUri = vscode.Uri.file(fullPath);

		vscode.commands.executeCommand('git.openChange', fileUri)
			.then(() => {
				// Successfully opened the file in git diff view
			}, (error) => {
				// If there was an error (e.g., no changes), open the file normally
				vscode.window.showInformationMessage('No changes to show in Git. Opening the file normally.');
				vscode.commands.executeCommand('vscode.open', fileUri);
			});
	});

	context.subscriptions.push(openFileCommand);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "sidebar-demo" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('sidebar-demo.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from sidebar-demo!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
