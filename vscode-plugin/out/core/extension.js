"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extensionInstance = exports.BallerinaExtension = void 0;
const path = require("path");
const vscode = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const node_1 = require("vscode-languageclient/node");
const outputChannel = vscode.window.createOutputChannel("Ballerina");
const LS_LAUNCHER_MAIN = "BallerinaLanguageServerLauncher";
class BallerinaExtension {
    setContext(context) {
        this.context = context;
    }
    async init() {
        try {
            //Server options. LS client will use these options to start the LS.
            let serverOptions = getServerOptions();
            //creating the language client.
            let clientId = "ballerina-vscode-lsclient";
            let clientName = "Ballerina LS Client";
            let clientOptions = {
                documentSelector: [{ scheme: "file", language: "ballerina" }],
                outputChannel: outputChannel,
                revealOutputChannelOn: vscode_languageclient_1.RevealOutputChannelOn.Never,
            };
            this.languageClient = new node_1.LanguageClient(clientId, clientName, serverOptions, clientOptions);
            const disposeDidChange = this.languageClient.onDidChangeState((stateChangeEvent) => {
                if (stateChangeEvent.newState === node_1.State.Stopped) {
                    vscode.window.showErrorMessage("Failed to initialize the extension");
                }
                else if (stateChangeEvent.newState === node_1.State.Running) {
                    vscode.window.showInformationMessage("Extension initialized successfully!");
                }
            });
            let disposable = this.languageClient.start();
            this.languageClient.onReady().then(() => {
                disposeDidChange.dispose();
                this.context.subscriptions.push(disposable);
            });
        }
        catch (exception) {
            return Promise.reject("Extension error!");
        }
    }
}
exports.BallerinaExtension = BallerinaExtension;
//Create a command to be run to start the LS java process.
function getServerOptions() {
    //Change the project home accordingly.
    const PROJECT_HOME = "/home/malintha/Documents/wso2/projects";
    const LS_LIB = "lsp-tutorial/ballerina-language-server/language_server_lib/*";
    const LS_HOME = path.join(PROJECT_HOME, LS_LIB);
    const JAVA_HOME = process.env.JAVA_HOME;
    let executable = path.join(String(JAVA_HOME), "bin", "java");
    let args = ["-cp", LS_HOME];
    let serverOptions = {
        command: executable,
        args: [...args, LS_LAUNCHER_MAIN],
        options: {},
    };
    return serverOptions;
}
exports.extensionInstance = new BallerinaExtension();
//# sourceMappingURL=extension.js.map