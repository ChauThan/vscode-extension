import * as vscode from 'vscode';

export class FileDataProvider implements vscode.TreeDataProvider<vscode.TreeItem>{

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        if(element){
            return Promise.resolve([]);
        }

        const fileNames = ['src/controller.ts', 'src/view.ts', 'README.md', 'package.json'];

        const treeItems = fileNames.map(fileName => {
            const treeItem = new vscode.TreeItem(fileName, vscode.TreeItemCollapsibleState.None);
           
            treeItem.command = {
                command: 'sidebar-demo.openFile',
                title: 'Open File',
                arguments: [fileName]
            };

            treeItem.iconPath = new vscode.ThemeIcon('file');

            return treeItem;
        });

        return Promise.resolve(treeItems);
    }
}