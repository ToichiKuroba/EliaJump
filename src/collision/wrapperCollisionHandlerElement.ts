import { AxisLine } from "./axisLine";
import { BaseWrapperCollisionHandlerElement } from "./baseWrapperCollisionHandlerElement";
import { CollisionElement } from "./collisionElement";
import { CollisionHandlerElement } from "./collisionHandlerElement";

export abstract class WrapperCollisionHandlerElement<CollisionElementType extends CollisionElement> extends BaseWrapperCollisionHandlerElement {
    protected _element: CollisionElementType;
    constructor(element: CollisionElementType) {
        super();
        this._element = element;
    }
    get element(): CollisionElement {
        return this._element;
    }

    get xAxisLine(): AxisLine {
        return new AxisLine(this._element.x, this._element.x + this._element.width);
    }

    get yAxisLine(): AxisLine {
        return new AxisLine(this._element.y, this._element.y + this._element.height);
    }

    detectCollision(collisionElement: CollisionHandlerElement): boolean {
        return this.xAxisLine.isCollision(collisionElement.xAxisLine) && this.yAxisLine.isCollision(collisionElement.yAxisLine);
    }
}