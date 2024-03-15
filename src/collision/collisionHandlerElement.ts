import { AxisLine } from "./axisLine";

export interface CollisionHandlerElement {
    get xAxisLine() : AxisLine;
    get yAxisLine() : AxisLine;
    get canColide() : boolean;
}