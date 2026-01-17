import * as vscode from "vscode";

let commentId = 1;

export class ReviewController {
    private controller: vscode.CommentController;

    constructor(context: vscode.ExtensionContext) {
        this.controller = vscode.comments.createCommentController("reviewController", "Code Review");
        context.subscriptions.push(this.controller);

        this.controller.commentingRangeProvider = {
            provideCommentingRanges: (
                document: vscode.TextDocument,
                _token: vscode.CancellationToken) => {
                    const lineCount = document.lineCount;
                    return [new vscode.Range(0, 0, lineCount - 1, 0)];
                }
        };

        context.subscriptions.push(
            vscode.commands.registerCommand("sidebarDemo.saveComment",
                (reply: vscode.CommentReply) => {
                    this.saveComment(reply);
                })
        );
    }

    private saveComment(reply: vscode.CommentReply) {
        const thread = reply.thread;
        const text = reply.text;

        const newComment = new NoteComment(
            text,
            vscode.CommentMode.Preview,
            { name: 'Me (Local)' },
            thread
        );

        thread.comments = [...thread.comments, newComment];
    }

    public addSystemComment(uri: vscode.Uri, line: number, message: string) {
        const range = new vscode.Range(line, 0, line, 0);
        const thread = this.controller.createCommentThread(uri, range, []);
        const systemComment = new NoteComment(
            message,
            vscode.CommentMode.Preview,
            { name: 'System' },
            thread
        );
        thread.comments = [systemComment];
        thread.collapsibleState = vscode.CommentThreadCollapsibleState.Expanded;
    }
}

class NoteComment implements vscode.Comment {
    id: number;
    label?: string | undefined; 
    constructor(
        public body: string | vscode.MarkdownString,
        public mode: vscode.CommentMode,
        public author: vscode.CommentAuthorInformation,
        public parent: vscode.CommentThread,
        public contextValue?: string
    ) {
        this.id = ++commentId;
    }
}