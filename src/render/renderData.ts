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

export function positionChanged(newData : RenderData, oldData?: RenderData) {
    return oldData?.x != newData.x || oldData.y != newData.y || oldData.width != newData.width || oldData.height != newData.height;
}