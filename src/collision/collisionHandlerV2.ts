import { GameField } from "../gameFlied";
import { BaseWrapperCollisionHandlerElement } from "./baseWrapperCollisionHandlerElement";
import { CollisionElement } from "./collisionElement";
import { CollisionHandlerElement } from "./collisionHandlerElement";
import { DefaultWrapperCollisionHandlerElement } from "./defaultWrapperCollisionHandlerElement";
import { isMovingCollisionElement } from "./movingCollisionElement";
import { MovingWrapperCollisionHandlerElement } from "./movingWrapperCollisionHandlerElement";
import { SurroundingCollidingElement } from "./surroundingCollidingElement";

export class CollisionHandler {
    private movingCollidingElements: MovingWrapperCollisionHandlerElement[] = [];
    private readonly _gameField: GameField;

    private collidingElementsWithoutZone: CollisionHandlerElement[] = [];
    private collisionElementZones: Map<number, CollisionHandlerElement[]> = new Map<number, CollisionHandlerElement[]>();

    constructor(gameField: GameField) {
        this._gameField = gameField;
        this._gameField.addResizeCallback(() => this.handleResize());
    }

    private handleResize() {
        if(this.collisionElementZones){
            const zones = this.collisionElementZones;
            this.collisionElementZones = new Map<number, CollisionHandlerElement[]>();
            zones.forEach(collisionHandlerElements => {
                for (let index = 0; index < collisionHandlerElements.length; index++) {
                    const element = collisionHandlerElements[index];
                    this.addToMap(element, this.collisionElementZones);
                }
            });
        }
    }

    add(element: CollisionElement) {
        if (isMovingCollisionElement(element)) {
            const wrapperElement = new MovingWrapperCollisionHandlerElement(element);
            this.movingCollidingElements.push(wrapperElement);
            this.collidingElementsWithoutZone.push(wrapperElement);
        } else {
            let wrapperElement = new DefaultWrapperCollisionHandlerElement(element);
            this.addToMap(wrapperElement, this.collisionElementZones);
        }
    }

    removeElement(element: CollisionElement) {
        this.movingCollidingElements = this.movingCollidingElements.filter(el => el.element != element);
        const filter = (el: CollisionHandlerElement) => !(el instanceof BaseWrapperCollisionHandlerElement) || el.element != element;
        this.collidingElementsWithoutZone = this.collidingElementsWithoutZone.filter(filter);
        this.collisionElementZones.forEach((elements, key, map) => {
            map.set(key, elements.filter(filter));
        });
    }

    detectCollisions() {
        const withoutZoneZoned = this.convertToZones(this.collidingElementsWithoutZone);
        for (let index = 0; index < this.movingCollidingElements.length; index++) {
            const movingElement = this.movingCollidingElements[index];
            if (movingElement.canColide) {
                const zones = this.calculateRelevantZoneIds(movingElement.yAxisLine.minPoint);
                for (let zoneIndex = 0; zoneIndex < zones.length; zoneIndex++) {
                    const zone = zones[zoneIndex];
                    if (zone !== undefined) {
                        const withoutZone = withoutZoneZoned.get(zone);
                        for (let collsionIndex = 0; withoutZone && collsionIndex < withoutZone.length; collsionIndex++) {
                            const collisionElement = withoutZone[collsionIndex];
                            if (collisionElement != movingElement && collisionElement.canColide) {
                                this.checkElement(movingElement, collisionElement);
                            }
                        }

                        const zoned = this.collisionElementZones.get(zone);
                        for (let collsionIndex = 0; zoned && collsionIndex < zoned.length; collsionIndex++) {
                            const collisionElement = zoned[collsionIndex];
                            if (collisionElement != movingElement && collisionElement.canColide) {
                                this.checkElement(movingElement, collisionElement);
                            }
                        }
                    }
                }

                this.checkElement(movingElement, new SurroundingCollidingElement(-Number.MAX_VALUE, -Number.MAX_VALUE, 0, Number.MAX_VALUE));

                this.checkElement(movingElement, new SurroundingCollidingElement(this._gameField.width, -Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE));

                this.checkElement(movingElement, new SurroundingCollidingElement(-Number.MAX_VALUE, this._gameField.viewHeight, Number.MAX_VALUE, Number.MAX_VALUE));
            }
        }
    }

    private convertToZones(elements: CollisionHandlerElement[]): Map<number, CollisionHandlerElement[]> {
        const map = new Map<number, CollisionHandlerElement[]>();
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            this.addToMap(element, map);
        }
        return map;
    }

    private checkElement(movingElement: MovingWrapperCollisionHandlerElement, collisionElement: CollisionHandlerElement) {
        if (movingElement.detectCollision(collisionElement)) {
            movingElement.fixCollision(collisionElement);
        }
    }

    private addToMap(element: CollisionHandlerElement, map: Map<number, CollisionHandlerElement[]>) {
        const zoneId = this.calculateZoneId(element.yAxisLine.minPoint);
        let zoneElements = map.get(zoneId);
        if (!zoneElements) {
            zoneElements = [];
            map.set(zoneId, zoneElements);
        }

        zoneElements.push(element);
    }

    private calculateZoneId(y: number) {
        return Math.floor(y / this._gameField.viewHeight);
    }

    private calculateRelevantZoneIds(y: number): [nextZone: number | undefined, currentZone: number, previusZone: number | undefined] {
        const currentZone = this.calculateZoneId(y);
        return [
            currentZone - 1,
            currentZone,
            currentZone < 0 ? currentZone + 1 : undefined
        ]
    }

    dispose() {
        this.movingCollidingElements = [];
        this.collidingElementsWithoutZone = [];
        this.collisionElementZones.clear();
    }
}