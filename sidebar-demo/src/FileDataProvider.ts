import * as vscode from 'vscode';

export class FileDataProvider implements vscode.TreeDataProvider<vscode.TreeItem>{

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        if(element){
            return Promise.resolve([]);
        }

        return Promise.resolve([
            new vscode.TreeItem('src/controller.ts', vscode.TreeItemCollapsibleState.None),
            new vscode.TreeItem('src/view.ts', vscode.TreeItemCollapsibleState.None),
            new vscode.TreeItem('src/README.md', vscode.TreeItemCollapsibleState.None)
        ]);
    }
}