import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

export class FileDataProvider implements vscode.TreeDataProvider<vscode.TreeItem>{

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
        if(element){
            return [];
        }

        const fileNames = await this.getChangedFilesFromGit();

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

        return treeItems;
    }

    private getChangedFilesFromGit(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            if(!vscode.workspace.workspaceFolders) {
                return resolve([]);
            }

            const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

            cp.exec('git diff --name-only', { cwd: rootPath }, (err, stdout, stderr) => {
                if (err) {
                    return reject(err);
                }

                const changedFiles = stdout.split('\n').filter(file => file.length > 0);
                resolve(changedFiles);
            });
        });
    }
}