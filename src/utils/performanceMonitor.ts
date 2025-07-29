import * as vscode from "vscode";

/**
 * Système de monitoring des performances pour identifier les goulots d'étranglement
 */
export class PerformanceMonitor {
    private static timings = new Map<string, number[]>();
    private static enabled = false;

    /**
     * Active le monitoring des performances
     */
    static enable(): void {
        this.enabled = true;
        this.timings.clear();
    }

    /**
     * Désactive le monitoring des performances
     */
    static disable(): void {
        this.enabled = false;
    }

    /**
     * Marque le début d'une opération
     */
    static startTiming(operation: string): number {
        if (!this.enabled) return 0;
        return performance.now();
    }

    /**
     * Marque la fin d'une opération et enregistre le temps
     */
    static endTiming(operation: string, startTime: number): void {
        if (!this.enabled || startTime === 0) return;
        
        const duration = performance.now() - startTime;
        
        if (!this.timings.has(operation)) {
            this.timings.set(operation, []);
        }
        
        this.timings.get(operation)!.push(duration);
        
        // Garder seulement les 100 dernières mesures
        const measurements = this.timings.get(operation)!;
        if (measurements.length > 100) {
            measurements.shift();
        }
    }

    /**
     * Mesure automatiquement une fonction
     */
    static async measure<T>(operation: string, fn: () => Promise<T>): Promise<T> {
        const start = this.startTiming(operation);
        try {
            const result = await fn();
            this.endTiming(operation, start);
            return result;
        } catch (error) {
            this.endTiming(operation, start);
            throw error;
        }
    }

    /**
     * Version synchrone de measure
     */
    static measureSync<T>(operation: string, fn: () => T): T {
        const start = this.startTiming(operation);
        try {
            const result = fn();
            this.endTiming(operation, start);
            return result;
        } catch (error) {
            this.endTiming(operation, start);
            throw error;
        }
    }

    /**
     * Retourne les statistiques de performance
     */
    static getStats(): Record<string, {
        count: number;
        average: number;
        min: number;
        max: number;
        total: number;
        recent: number; // Dernière mesure
    }> {
        const stats: Record<string, any> = {};
        
        for (const [operation, measurements] of this.timings.entries()) {
            if (measurements.length === 0) continue;
            
            const total = measurements.reduce((sum, time) => sum + time, 0);
            const average = total / measurements.length;
            const min = Math.min(...measurements);
            const max = Math.max(...measurements);
            const recent = measurements[measurements.length - 1];
            
            stats[operation] = {
                count: measurements.length,
                average: Math.round(average * 100) / 100,
                min: Math.round(min * 100) / 100,
                max: Math.round(max * 100) / 100,
                total: Math.round(total * 100) / 100,
                recent: Math.round(recent * 100) / 100
            };
        }
        
        return stats;
    }

    /**
     * Affiche un rapport de performance dans la console
     */
    static printReport(): void {
        const stats = this.getStats();
        
        console.log("\n🔍 Rapport de Performance Minecraft Bedrock Extension");
        console.log("=" .repeat(60));
        
        // Trier par temps moyen décroissant
        const sortedOperations = Object.entries(stats)
            .sort(([,a], [,b]) => b.average - a.average);
        
        for (const [operation, stat] of sortedOperations) {
            console.log(`\n📊 ${operation}:`);
            console.log(`   Moyenne: ${stat.average}ms (${stat.count} mesures)`);
            console.log(`   Min/Max: ${stat.min}ms / ${stat.max}ms`);
            console.log(`   Récent: ${stat.recent}ms`);
            
            // Alerte si performance dégradée
            if (stat.average > 100) {
                console.log(`   ⚠️  LENT - Moyenne > 100ms`);
            } else if (stat.average > 50) {
                console.log(`   ⚡ Acceptable - Moyenne < 100ms`);
            } else {
                console.log(`   ✅ Rapide - Moyenne < 50ms`);
            }
        }
        
        console.log("\n" + "=".repeat(60));
    }

    /**
     * Retourne les opérations les plus lentes
     */
    static getSlowestOperations(limit: number = 5): Array<{ operation: string; averageTime: number }> {
        const stats = this.getStats();
        
        return Object.entries(stats)
            .map(([operation, stat]) => ({ operation, averageTime: stat.average }))
            .sort((a, b) => b.averageTime - a.averageTime)
            .slice(0, limit);
    }

    /**
     * Commande VS Code pour afficher le rapport
     */
    static registerCommands(context: vscode.ExtensionContext): void {
        // Commande pour activer le monitoring
        context.subscriptions.push(
            vscode.commands.registerCommand('minecraft-bedrock-creators-utilities.enablePerformanceMonitoring', () => {
                this.enable();
                vscode.window.showInformationMessage('Monitoring de performance activé');
            })
        );

        // Commande pour désactiver le monitoring
        context.subscriptions.push(
            vscode.commands.registerCommand('minecraft-bedrock-creators-utilities.disablePerformanceMonitoring', () => {
                this.disable();
                vscode.window.showInformationMessage('Monitoring de performance désactivé');
            })
        );

        // Commande pour afficher le rapport
        context.subscriptions.push(
            vscode.commands.registerCommand('minecraft-bedrock-creators-utilities.showPerformanceReport', () => {
                this.printReport();
                
                const stats = this.getStats();
                const operationCount = Object.keys(stats).length;
                const slowest = this.getSlowestOperations(3);
                
                let message = `Rapport généré avec ${operationCount} opérations monitorées.`;
                if (slowest.length > 0) {
                    message += `\nOpération la plus lente: ${slowest[0].operation} (${slowest[0].averageTime}ms)`;
                }
                
                vscode.window.showInformationMessage(message, { modal: true });
            })
        );
    }
}
