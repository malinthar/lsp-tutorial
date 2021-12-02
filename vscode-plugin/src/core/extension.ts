import path = require("path");
import * as vscode from "vscode";
import {
  LanguageClientOptions,
  RevealOutputChannelOn,
} from "vscode-languageclient";

import {
  LanguageClient,
  ServerOptions,
  State,
} from "vscode-languageclient/node";

const outputChannel = vscode.window.createOutputChannel("Ballerina");
const LS_LAUNCHER_MAIN: string = "BallerinaLanguageServerLauncher";

export class BallerinaExtension {
  private languageClient?: LanguageClient;
  private context?: vscode.ExtensionContext;

  setContext(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async init(): Promise<void> {
    try {
      //Server options. LS client will use these options to start the LS.
      let serverOptions: ServerOptions = getServerOptions();

      //creating the language client.
      let clientId = "ballerina-vscode-lsclient";
      let clientName = "Ballerina LS Client";
      let clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: "file", language: "ballerina" }],
        outputChannel: outputChannel,
        revealOutputChannelOn: RevealOutputChannelOn.Never,
      };
      this.languageClient = new LanguageClient(
        clientId,
        clientName,
        serverOptions,
        clientOptions
      );

      const disposeDidChange = this.languageClient.onDidChangeState(
        (stateChangeEvent) => {
          if (stateChangeEvent.newState === State.Stopped) {
            vscode.window.showErrorMessage(
              "Failed to initialize the extension"
            );
          } else if (stateChangeEvent.newState === State.Running) {
            vscode.window.showInformationMessage(
              "Extension initialized successfully!"
            );
          }
        }
      );

      let disposable = this.languageClient.start();
      this.languageClient.onReady().then(() => {
        disposeDidChange.dispose();
        this.context!.subscriptions.push(disposable);
      });
    } catch (exception) {
      return Promise.reject("Extension error!");
    }
  }
}

//Create a command to be run to start the LS java process.
function getServerOptions() {
  //Change the project home accordingly.
  const PROJECT_HOME = "/home/malintha/Documents/wso2/projects";
  const LS_LIB = "lsp-tutorial/ballerina-language-server/language_server_lib/*";
  const LS_HOME = path.join(PROJECT_HOME, LS_LIB);
  const JAVA_HOME = process.env.JAVA_HOME;

  let executable: string = path.join(String(JAVA_HOME), "bin", "java");
  let args: string[] = ["-cp", LS_HOME];

  let serverOptions: ServerOptions = {
    command: executable,
    args: [...args, LS_LAUNCHER_MAIN],
    options: {},
  };
  return serverOptions;
}

export const extensionInstance = new BallerinaExtension();
