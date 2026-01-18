// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as http from 'http';
import path from 'path';

let timeLeft = 0;
let timerInterval: NodeJS.Timeout | undefined;
let isRunning = false;

function stopPomodoro() {
    isRunning = false;
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    vscode.window.showInformationMessage('Pomodoro session stopped.');
}

function startPomodoro() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timeLeft = 25 * 60; // 25 minutes in seconds
    isRunning = true;

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
        }
        else {
            isRunning = false;
            if (timerInterval) {
                clearInterval(timerInterval);
            }
            vscode.window.showInformationMessage('Pomodoro session ended! Time for a break.');
        }
    }, 1000);
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const startCmd = vscode.commands.registerCommand('mcp-demo.start', () => {
        startPomodoro();
        vscode.window.showInformationMessage('MCP Demo: Pomodoro session started for 25 minutes!');
    });
    context.subscriptions.push(startCmd);

    const server = http.createServer((req, res) => {
        const url = new URL(req.url || '', `http://${req.headers.host}`);

        if (url.pathname === '/status') {
            res.writeHead(200, { 'Content-Type': 'application/json' });

            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            res.end(JSON.stringify({
                isRunning: isRunning,
                timeLeftInSeconds: timeLeft,
                formattedTime: `${minutes}m ${seconds}s`,
                message: isRunning ? "Focus on your work!" : "Take a break!"
            }));
        }

        if (url.pathname === '/control') {
            const action = url.searchParams.get('action');
            if (action === 'start') {
                if (!isRunning) {
                    startPomodoro();
                }
                res.end(JSON.stringify({ status: "Pomodoro started" }));
            }
            else if (action === 'stop') {
                if (isRunning) {
                    stopPomodoro();
                }
                res.end(JSON.stringify({ status: "Pomodoro stopped" }));
            }
            else {
                res.writeHead(400);
                res.end(JSON.stringify({ error: "Invalid action. Use 'start' or 'stop'." }));
            }
            return;
        }

        res.writeHead(404);
        res.end(JSON.stringify({ error: "Endpoint not found" }));
    });

    server.listen(3456, '127.0.0.1', () => {
        console.log('✅ Server is listening on http://127.0.0.1:3456');
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
        if (err && err.code === 'EADDRINUSE') {
            console.error('❌ Port 3456 is already in use. Please close the other application using this port and restart the extension.');
        }
    });

    const mcpProvider = vscode.lm.registerMcpServerDefinitionProvider('my-mcp-id', {
        provideMcpServerDefinitions(token) {
            // Reference the path to the compiled MCP server script
            const serverPath = path.join(context.extensionPath, 'out', 'mcp-server.js');

            return [new vscode.McpStdioServerDefinition('Demo MCP Server', 'node', [serverPath])];
        }
    });

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "mcp-demo" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('mcp-demo.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from mcp-demo!');
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}
