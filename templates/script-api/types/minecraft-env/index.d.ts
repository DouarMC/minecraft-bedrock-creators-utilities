// @ts-nocheck

/** Console QuickJS de Mojang */
interface Console {
    log: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    info: (...args: any[]) => void;
}

declare const console: Console;

/** Alias QuickJS/Minecraft de console.log */
declare function print(...args: any[]): void;