import { RenderMap } from "./renderMap";

export interface RenderData {
    rendererKey: keyof RenderMap,
    x: number,
    y: number,
    width: number,
    height: number,
    transferables: Transferable[],
    needsRerender: boolean,
    prevRenderData: RenderData | undefined,
}