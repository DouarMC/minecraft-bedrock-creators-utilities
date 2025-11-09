import { MinecraftGame } from "./MinecraftGame";

export class MinecraftPreviewGame extends MinecraftGame {
    protected readonly installFolderName = "Minecraft Preview for Windows";
    protected readonly userDataFolderName = "Minecraft Bedrock Preview";
}