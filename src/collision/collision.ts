import { CollisionType } from "./collisionType";

export interface CollisionV2 {
    contactX: number;
    contactY: number;
    timeOfContact: number;
    type: CollisionType;

}