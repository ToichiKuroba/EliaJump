import { GameElementState } from "../elements/gameElementState";
import { CollisionV2 } from "./collision";
import { CollisionElement } from "./collisionElement";


export function isMovingCollisionElement(collisionElement: CollisionElement): collisionElement is MovingCollisionElement{
    const movingCollisionElement = (collisionElement as MovingCollisionElement);
    return movingCollisionElement.speedX !== undefined && movingCollisionElement.speedY !== undefined && movingCollisionElement.wantsTofixCollision !== undefined;
}


export interface MovingCollisionElement extends CollisionElement {
    get speedX() : number;
    get speedY() : number;
    get wantsTofixCollision() : boolean;
    state: GameElementState;
    fixCollision(collision: CollisionV2): void;
}
