/* eslint-disable @typescript-eslint/naming-convention */

import { Serializable } from 'ts-serializable';
import { fileURLToPath } from 'url';
import * as vscode from 'vscode';
import { PVSReport, PVSWarningsInfo } from './PVSReport';
import 'reflect-metadata';
//const DataTables = require('datatables.net');
//const DataTablesDT = require('datatables.net-dt');

//import jsdom = require( 'jsdom');

//import { loadJsonFile, loadJsonFileSync } from "load-json-file";

export var err="";
export var data = "";
const jsonFile = require('jsonfile');

class PVSReportProvide implements vscode.WebviewViewProvider
{
	public _view?: vscode.WebviewView;

	private pReport : PVSReport = new PVSReport();

	public static readonly viewType = 'PVSPanelView';
	constructor(
		private readonly _extensionUri: vscode.Uri, private readonly PVSReports : PVSReport = new PVSReport(),
		private readonly contextVSCode : vscode.ExtensionContext
	) 
	{ 
		this.pReport = PVSReports;
	}

	
	public UpdateTable(PVSRep : PVSReport)
	{
		if(this._view)
	      {this._view.webview.html = CreateTable(PVSRep);}
	}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = CreateTable(this.pReport);

		webviewView.webview.onDidReceiveMessage(MsgIt =>{
			switch(MsgIt.command){
				case 'ShowFile':
					{
				 let TextDoc =  vscode.workspace.openTextDocument(MsgIt.file);
					
				 TextDoc.then(value => {
					 let editor = vscode.window.showTextDocument(value, {preview: true});
					     MsgIt.line -= 1;
						 MsgIt.endLine -= 1;
						 MsgIt.endColumn -= 1;
						 MsgIt.column -= 1;
					     editor.then(edit =>{ {
					     edit.selection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 0));
						 const Pos = edit.selection.active;
						 const NewPos = Pos.with(MsgIt.line, MsgIt.column);
						 const newSelection = new vscode.Selection(NewPos, new vscode.Position(MsgIt.endLine, MsgIt.endColumn));
						 edit.selection = newSelection;
					 }});
		    	 });
				 break;
			}
			}
		 }, undefined, this.contextVSCode.subscriptions);
    
		 
		
	}
}


export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "pvs-studio-plugin" is now active!');

	const PVSWebpanelPrivider = new PVSReportProvide(context.extensionUri, new PVSReport(), context);
	var DisponseWebPanel = vscode.window.registerWebviewViewProvider("PVSPanelView", PVSWebpanelPrivider);
    
	if(PVSWebpanelPrivider._view)
	{
		//PVSWebpanelPrivider._view.webview.
	}


	let disposable = vscode.commands.registerCommand('pvs-studio-plugin.OpenReportsFile', () => {
	
		var PVSJSON = vscode.window.showOpenDialog();
	    


		PVSJSON.then( prop => {
			prop?.forEach(file=>{
				if(file.scheme === 'file')
				{				
					    console.log(file.fsPath);
                        const Report = jsonFile.readFileSync(file.fsPath);
						console.log(Report);
						/* let ReportProvideData = new PVSReportProvide(context.extensionUri, Report, context);
						vscode.window.registerWebviewViewProvider("PVSPanelView", ReportProvideData);	 */	
						PVSWebpanelPrivider.UpdateTable(Report);
						
				}
			});
		});
	
	});
	context.subscriptions.push(disposable);
	context.subscriptions.push(DisponseWebPanel);
}

var dtScript =`
 <script> 
    
    const vscode = acquireVsCodeApi();

    const table = $('#pvst').DataTable({
		paging: true,
		responsive: true
	}); 

	function ShowFile(filePath, line, endLine, column, endColumn)
	{
		filePath.replaceAll("\\\\", "////////");
		
		vscode.postMessage({
			command: 'ShowFile',
			file: filePath,
			line: line,
			endLine: endLine,
			column: column,
			endColumn: endColumn
		});
	}
	
</script>`;



function CreateTable(pvsrep : PVSReport)
{
	let html = `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Cat Coding</title>
		
				
		<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.css"/>
		<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/responsive/2.2.9/css/responsive.dataTables.css"/>
		 
		<script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.js"></script>
		<script type="text/javascript" src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.js"></script>
		<script type="text/javascript" src="https://cdn.datatables.net/responsive/2.2.9/js/dataTables.responsive.js"></script>
		
		
        

	</head> <body style="background: white">`;

	 html  += '<table id="pvst" border="1px solid" style="background: black">';
     html += '<thead><tr><th>Code</th><th>CWE</th><th>SAST</th><th>Message</th><th>Project</th><th>File</th></tr></thead><tbody>';
     
	 pvsrep.warnings.forEach((warning) =>{ 
      html+= '<tr  style="background: #2c3136">' + "<td>" + warning.code + "</td>"+ "<td>" + warning.cwe + "</td><td>" + warning.sastId + 
	  "</td><td>"+warning.message+ "</td><td>";
	  warning.projects.forEach((proj)=>{
        html+= "" + proj + "<br>";
	  });
html+="</td><td>";
	  warning.positions.forEach(element => {
		  html+= "<a onclick= 'ShowFile(\""+ element.file.replace(/\\/g, '\\\\') +"\", "+element.line+", "+element.endLine+", "+element.column+", "+element.endColumn+")' >"+ element.file +"</a>" + "(" + element.line + ")<br>";
		
	  });
	  html+= "</td></tr>";
	 });

	html+="</tbody></table>";
   html+=dtScript;
   html+= "</body></html>";
	return html;
}

// this method is called when your extension is deactivated
export function deactivate() {}
