import * as vscode from "vscode";
import { Feature } from "../Feature";
import * as zlib from "zlib";
import { promisify } from "util";

const gunzip = promisify(zlib.gunzip);

interface McStatsTickData {
    tick: number;
    scriptTime: number; // en microsecondes
    ramUsed: number;    // en bytes
}

export class McStatsVisualizerFeature extends Feature {
    private static readonly MCSTATS_VISUALIZER_COMMAND_ID = "minecraft-bedrock-creators-utilities.visualizeMcStats";

    public register(): void {
        const disposable = vscode.commands.registerCommand(McStatsVisualizerFeature.MCSTATS_VISUALIZER_COMMAND_ID, async () => {
            const mcstatsFileUri = await vscode.window.showOpenDialog({
                canSelectFolders: false,
                canSelectFiles: true,
                filters: {
                    "Fichiers McStats": ["mcstats"]
                },
                openLabel: "Choisir le fichier .mcstats à visualiser.",
                canSelectMany: false,
                title: "Sélectionner un fichier .mcstats pour visualiser les statistiques Minecraft"
            });

            if (mcstatsFileUri === undefined || mcstatsFileUri.length === 0) {
                vscode.window.showWarningMessage("Aucun fichier sélectionné. La visualisation a été annulée.");
                return;
            }

            const fileUri = mcstatsFileUri[0];
            const fileData = await vscode.workspace.fs.readFile(fileUri);
            const content = Buffer.from(fileData).toString('utf8');

            try {
                const lines = content.split(/\r?\n/).filter(line => line.trim() !== "");
                if (lines.length === 0) {
                    throw new Error("Le fichier est vide.");
                }

                const header = JSON.parse(lines[0]);
                if (header.encoding !== "base64-gzip") {
                    throw new Error("Le fichier .mcstats doit être encodé en base64-gzip.");
                }

                const dataBlocks = lines.slice(1);
                if (dataBlocks.length === 0) {
                    throw new Error("Aucun bloc de données trouvé dans le fichier.");
                }

                const allStats: McStatsTickData[] = [];
                await vscode.window.withProgress(
                    {
                        location: vscode.ProgressLocation.Notification,
                        title: "Analyse du fichier .mcstats...",
                        cancellable: false
                    },
                    async (progress) => {
                        const total = dataBlocks.length;
                        for (let i = 0; i < total; i++) {
                            const decoded = await this.decodeBlock(dataBlocks[i]);
                            if (decoded) {
                                const metrics = this.extractMetrics(decoded);
                                if (metrics) {
                                    allStats.push(metrics);
                                }
                            }

                            // Mise à jour de la barre de progression tous les 50 blocs
                            if (i % 50 === 0) {
                                progress.report({ increment: (50 / total) * 100, message: `${i}/${total} ticks` });
                            }
                        }
                    }
                );

                console.log(`Analyse terminée. ${allStats.length} points de données prêts.`);
                this.visualizeData(allStats);
            } catch (error) {
                vscode.window.showErrorMessage("Erreur de structure .mcstats : " + error);
            }
        });

        this.extensionContext.subscriptions.push(disposable);
    }

    private async decodeBlock(base64Data: string): Promise<any> {
        try {
            const buffer = Buffer.from(base64Data, "base64");
            const decompressed = await gunzip(buffer);
            return JSON.parse(decompressed.toString('utf-8'));
        } catch (error) {
            console.error("Échec du décodage d'un bloc :", error);
            return null;
        }
    }

    private extractMetrics(decodedBlock: any): McStatsTickData | null {
        try {
            const tick = decodedBlock.tick;
            
            // Extraction du temps de script
            const timings = decodedBlock.stats.find((s: any) => s.name === "server_tick_timings");
            const scriptTickEntry = timings?.children?.find((c: any) => c.name === "script_tick");
            const scriptTime = scriptTickEntry?.values ? scriptTickEntry.values[0] : 0;

            // Extraction de la RAM (utilisée par le runtime)
            const runtimeMem = decodedBlock.stats.find((s: any) => s.name === "runtime_memory");
            const ramUsedEntry = runtimeMem?.children?.find((c: any) => c.name === "used");
            const ramUsed = ramUsedEntry?.values ? ramUsedEntry.values[0] : 0;

            return { tick, scriptTime, ramUsed };
        } catch (e) {
            return null;
        }
    }

    private visualizeData(data: McStatsTickData[]) {
        const panel = vscode.window.createWebviewPanel(
            'mcStatsVisualizer',
            'Minecraft Stats Visualizer',
            vscode.ViewColumn.One,
            {
                enableScripts: true, // IMPORTANT pour Chart.js
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = this.getWebviewContent(data);
    }

    private getWebviewContent(data: McStatsTickData[]): string {
        const chartData = JSON.stringify(data);

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <style>
                    body { background-color: #1e1e1e; color: white; padding: 20px; font-family: sans-serif; }
                    .container { width: 100%; max-width: 1000px; margin: auto; }
                    canvas { background-color: #252526; border-radius: 8px; margin-bottom: 30px; }
                    h2 { color: #007acc; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Statistiques de Script (μs)</h2>
                    <canvas id="scriptChart"></canvas>
                    
                    <h2>Utilisation RAM (Mo)</h2>
                    <canvas id="ramChart"></canvas>
                </div>

                <script>
                    const data = ${chartData};
                    const labels = data.map(d => d.tick);

                    // Graphique CPU
                    new Chart(document.getElementById('scriptChart'), {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'Temps de Script (μs)',
                                data: data.map(d => d.scriptTime),
                                borderColor: '#007acc',
                                backgroundColor: 'rgba(0, 122, 204, 0.2)',
                                fill: true,
                                borderWidth: 1,
                                pointRadius: 0 // Plus fluide pour bcp de données
                            }]
                        },
                        options: {
                            scales: {
                                y: { 
                                    beginAtZero: true,
                                    grid: { color: '#333' }
                                }
                            }
                        }
                    });

                    // Graphique RAM
                    new Chart(document.getElementById('ramChart'), {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: 'RAM (Mo)',
                                data: data.map(d => (d.ramUsed / 1024 / 1024).toFixed(2)),
                                borderColor: '#4ec9b0',
                                backgroundColor: 'rgba(78, 201, 176, 0.2)',
                                fill: true,
                                borderWidth: 1,
                                pointRadius: 0
                            }]
                        }
                    });
                </script>
            </body>
            </html>
        `;
    }
}