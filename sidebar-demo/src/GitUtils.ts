import * as cp from 'child_process';
import * as vscode from 'vscode';
import * as path from 'path';

export function getChangedLines(fileName: string): Promise<number[]> {
    return new Promise((resolve) => {
        if (!vscode.workspace.workspaceFolders) {
            return resolve([]);
        }

        const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

        // Run `git diff` with `-U0` to get the exact changed lines
        // `HEAD` compares the working tree against the latest commit
        cp.exec(`git diff -U0 HEAD "${fileName}"`, { cwd: rootPath }, (err, stdout, stderr) => {
            if (err || stderr) {
                return resolve([]);
            }

            const changedLines: number[] = [];
            
            // Regex to match hunks like: @@ -old,count +new,count @@
            // We only care about the + (new) side which indicates lines in the new file
            const regex = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm;
            let match;

            while ((match = regex.exec(stdout)) !== null) {
                // match[1] is the starting line number of the change (Git is 1-based)
                const startLine = parseInt(match[1]);
                
                const lineToComment = startLine > 0 ? startLine - 1 : 0;
                changedLines.push(lineToComment);
            }

            resolve(changedLines);
        });
    });
}