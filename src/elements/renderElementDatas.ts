import { RenderData } from "../render/renderData";
import { RenderPrio } from "./renderPrio";


export interface RenderElementDatas {
    datas: Map<RenderPrio, RenderData[]>[];
    transferables: Transferable[];
}
