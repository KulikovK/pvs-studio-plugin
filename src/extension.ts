/* eslint-disable @typescript-eslint/naming-convention */

import { Serializable } from 'ts-serializable';
import { fileURLToPath } from 'url';
import * as vscode from 'vscode';
import { PVSReport } from './PVSReport';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "pvs-studio-plugin" is now active!');


	let disposable = vscode.commands.registerTextEditorCommand('pvs-studio-plugin.OpenReportsFile', (tEditor) => {
		
		const PVSJsonReports = new PVSReport().fromJSON(JSON.parse(tEditor.document.getText()));


		const PVSReportsPanel = vscode.window.createWebviewPanel(
			'Reports view',
			'PVS-Report View',
			vscode.ViewColumn.One,
			{}
		  );
		  PVSReportsPanel.webview.html = CreateTable(PVSJsonReports);


	});

	context.subscriptions.push(disposable);
}


function CreateTable(pvsrep : PVSReport)
{
	let html  = '<table border="1px solid"';
     html += '<tr><th>Code</th><th>CWE</th><th>SAST</th><th>Message</th><th>File</th></tr>';
     
	 pvsrep.warnings.forEach((warning) =>{
      html+= "<tr>" + "<td>" + warning.code + "</td>"+ "<td>" + warning.cwe + "</td><td>" + warning.sastId + 
	  "</td><td>"+warning.message+ "</td><td>";
	  warning.positions.forEach(element => {
		  html+= "<br><a href='>" + element.file + "'>"+ element.file +"</a>" + "(" + element.line + ")";
	  });
	  html+= "</td></tr>";
	 });

	html+="</table>";
	return html;
}

// this method is called when your extension is deactivated
export function deactivate() {}
