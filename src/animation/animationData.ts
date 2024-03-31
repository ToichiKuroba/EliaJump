import { RenderData } from "../render/renderData";

export interface AnimationData {
    x: number;
    y: number;
    height: number;
    width: number;
    prevRenderData: RenderData | undefined
}