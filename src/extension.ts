/* eslint-disable @typescript-eslint/naming-convention */

import { Serializable } from 'ts-serializable';
import { fileURLToPath } from 'url';
import * as vscode from 'vscode';
import { PVSReport, PVSWarningsInfo } from './PVSReport';
import 'reflect-metadata';
//const DataTables = require('datatables.net');
//const DataTablesDT = require('datatables.net-dt');

import "jquery";





//import jsdom = require( 'jsdom');





//import { loadJsonFile, loadJsonFileSync } from "load-json-file";
import * as fs from "fs";

export var err="";
export var data = "";
const jsonFile = require('jsonfile');



class PVSReportProvide implements vscode.WebviewViewProvider
{
	private _view?: vscode.WebviewView;

	public static readonly viewType = 'PVSPanelView';
	constructor(
		private readonly _extensionUri: vscode.Uri, private readonly PVSReports : PVSReport = new PVSReport(),
		private readonly contextVSCode : vscode.ExtensionContext
	) { }

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

		

		webviewView.webview.html = CreateTable(this.PVSReports);

		webviewView.webview.onDidReceiveMessage(MsgIt =>{
			switch(MsgIt.command){
				case 'ShowFile':
					{
					// vscode.window.showInformationMessage(MsgIt.file);
					 vscode.window.showInformationMessage(MsgIt.line);
					 let TextDoc =  vscode.workspace.openTextDocument(MsgIt.file);
					
				 TextDoc.then(value => {
					 let editor = vscode.window.showTextDocument(value, {preview: true});
					     MsgIt.line -= 1;
					     editor.then(edit =>{ {
					     edit.selection = new vscode.Selection(new vscode.Position(0, 0), new vscode.Position(0, 0));
						 const Pos = edit.selection.active;
						 const NewPos = Pos.with(MsgIt.line, 0);
						 const newSelection = new vscode.Selection(NewPos, new vscode.Position(MsgIt.line, 2147483647));
						 edit.selection = newSelection;
					 }});
				 });
					}
			}
		 }, undefined, this.contextVSCode.subscriptions);

	}


	 

}


export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "pvs-studio-plugin" is now active!');


	let disposable = vscode.commands.registerCommand('pvs-studio-plugin.OpenReportsFile', () => {
	
		var PVSJSON = vscode.window.showOpenDialog();
		let test : PVSReport = new PVSReport();

	/* 	const PVSReportsPanel = vscode.window.createWebviewPanel(
			'PVSPanelView',
			'PVS-Report View',
			vscode.ViewColumn.Beside,
			{enableScripts: true}
		  ); */

	
		  

	
  

		PVSJSON.then( prop => {
		
			prop?.forEach(file=>{
				if(file.scheme === 'file')
				{				
					    console.log(file.fsPath);
                        const Report = jsonFile.readFileSync(file.fsPath);
						console.log(Report);
						let ReportProvideData = new PVSReportProvide(context.extensionUri, Report, context);
						vscode.window.registerWebviewViewProvider("PVSPanelView", ReportProvideData);
						
						var n= CreateTable(Report);
									
				}
			});
		});
	
	});

	
   
    
 



	context.subscriptions.push(disposable);
}

var dtScript =`
 <script> 
    const table = $('#pvst').DataTable({
		paging: true,
		responsive: true
	}); 

	function ShowFile(filePath, line)
	{
		filePath.replaceAll("\\\\", "////////");
		const vscode = acquireVsCodeApi();
		vscode.postMessage({
			command: 'ShowFile',
			file: filePath,
			line: line
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
		  html+= "<a onclick= 'ShowFile(\""+ element.file.replace(/\\/g, '\\\\') +"\", "+element.line+")' >"+ element.file +"</a>" + "(" + element.line + ")<br>";
		
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
