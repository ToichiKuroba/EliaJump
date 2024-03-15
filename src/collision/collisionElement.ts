export function isCollisionElement(element: unknown) : element is CollisionElement {
    return (element as CollisionElement)?.canCollide === true;
}

export interface CollisionElement {
    get width(): number;
    get height(): number;
    get y(): number;
    get x(): number;
    get canCollide(): boolean;
}

