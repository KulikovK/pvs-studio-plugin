/* eslint-disable @typescript-eslint/naming-convention */

import { Serializable } from 'ts-serializable';
import { fileURLToPath } from 'url';
import * as vscode from 'vscode';
import { PVSReport, PVSWarningsInfo } from './PVSReport';
import 'reflect-metadata';
//const DataTables = require('datatables.net');
//const DataTablesDT = require('datatables.net-dt');




import jsdom = require( 'jsdom');
import $ = require('jquery');


//import jsdom = require( 'jsdom');

import 'datatables.net';
import 'datatables.net-dt';



//import { loadJsonFile, loadJsonFileSync } from "load-json-file";
import * as fs from "fs";

export var err="";
export var data = "";
const jsonFile = require('jsonfile');



export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "pvs-studio-plugin" is now active!');


	let disposable = vscode.commands.registerCommand('pvs-studio-plugin.OpenReportsFile', () => {
	
		var PVSJSON = vscode.window.showOpenDialog();
		let test : PVSReport = new PVSReport();

		const PVSReportsPanel = vscode.window.createWebviewPanel(
			'Reports view',
			'PVS-Report View',
			vscode.ViewColumn.One,
			{enableScripts: true}
		  );

		PVSJSON.then( prop => {
		
			prop?.forEach(file=>{
				if(file.scheme === 'file')
				{				
					    console.log(file.fsPath);
                        const Report = jsonFile.readFileSync(file.fsPath);
						console.log(Report);
						PVSReportsPanel.webview.html = CreateTable(Report);
							/* const table = $('#pvst').DataTable({
								paging: true
							}); */
									
				}
			});
		});
	
	});

	
	context.subscriptions.push(disposable);
}

var dtScript =`
 <script> 
    const table = $('#pvst').DataTable({
		paging: true
	}); 
	
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
        <script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.js"></script>
        <script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.js"></script>
        <script type="text/javascript" src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.js"></script>
        

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
		  html+= "<a href='>" + element.file + "'>"+ element.file +"</a>" + "(" + element.line + ")<br>tsc ";
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
