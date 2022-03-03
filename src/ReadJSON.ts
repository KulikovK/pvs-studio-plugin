/* import { readFileSync } from 'fs';
import * as vscode from "vscode";

import { PVSReport } from './PVSReport';
export async function loadLogs(uris: vscode.Uri[], token?: { isCancellationRequested: boolean }) {
    const logs = uris
        .map(uri => {
            if (token?.isCancellationRequested) return undefined;
            try {
                const file = readFileSync(uri.fsPath, 'utf8')  // Assume scheme file.
                    .replace(/^\uFEFF/, ''); // Trim BOM.
                const log = JSON.parse(file) as PVSReport;
                file = uri.toString();
                return log;
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to parse '${uri.fsPath}'`);
                return undefined;
            }
        })
        .filter(log => log) as PVSReport[];

    //logs.forEach(log => Telemetry.sendLogVersion(log.version, log.$schema ?? ''));
    //logs.forEach(tryFastUpgradeLog);

    const logsSupported = [] as PVSReport[];
    const logsNotSupported = [] as PVSReport[];
   const warnUpgradeExtension =  detectUpgrade(log, logsSupported, logsNotSupported));
    for (const log of logsNotSupported) {
        if (token?.isCancellationRequested) break;
        const {fsPath} = Uri.parse(log._uri, true);
        vscode.window.showWarningMessage(`'${fsPath}' was not loaded. Version '${log.version}' and schema '${log.$schema ?? ''}' is not supported.`);
    }
    logsSupported.forEach(log => augmentLog(log, driverlessRules));
    if (warnUpgradeExtension) {
        window.showWarningMessage('Some log versions are newer than this extension.');
    }
    return logsSupported;
} */