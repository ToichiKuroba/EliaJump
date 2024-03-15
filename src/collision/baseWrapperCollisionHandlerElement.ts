import { AxisLine } from "./axisLine";
import { CollisionElement } from "./collisionElement";
import { CollisionHandlerElement } from "./collisionHandlerElement";

export abstract class BaseWrapperCollisionHandlerElement implements CollisionHandlerElement {
    get canColide(): boolean {
        return this.element.canCollide;
    }
    abstract get xAxisLine(): AxisLine;
    abstract get yAxisLine(): AxisLine;
    abstract get element(): CollisionElement;
}