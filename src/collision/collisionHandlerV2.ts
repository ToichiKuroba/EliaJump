import { GameField } from "../gameFlied";
import { CollisionElement } from "./collisionElement";
import { MovingCollisionElement } from "./movingCollisionElement";
import { SurroundingCollidingElement } from "./surroundingCollidingElement";

export class CollisionHandler {
    private collidingElements: CollisionElement[] = [];
    private readonly _gameField: GameField;

    constructor(gameField: GameField) {
        this._gameField = gameField;
    }

    
    add(element: CollisionElement) {
        this.collidingElements.push(element);
    }

    removeElement(element: CollisionElement) {
        this.collidingElements = this.collidingElements.filter(el => el != element);
    }

    detectCollisions() {
        for (let index = 0; index < this.collidingElements.length; index++) { 
            const movingElement = this.collidingElements[index];
            if(movingElement instanceof MovingCollisionElement) {
                for (let collsionIndex = 0; collsionIndex < this.collidingElements.length; collsionIndex++) {
                    if(collsionIndex != index) {
                        const collisionElement = this.collidingElements[collsionIndex];
                        this.checkElement(movingElement, collisionElement);
                    }
                }
                
                this.checkElement(movingElement, new SurroundingCollidingElement(-Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, -(this._gameField.viewHeight + this._gameField.yTranslation)));
                
                this.checkElement(movingElement, new SurroundingCollidingElement(-Number.MAX_VALUE, -Number.MAX_VALUE, 0, Number.MAX_VALUE));
                
                this.checkElement(movingElement, new SurroundingCollidingElement(this._gameField.width, -Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE));
                
                this.checkElement(movingElement, new SurroundingCollidingElement(-Number.MAX_VALUE, this._gameField.viewHeight, Number.MAX_VALUE, Number.MAX_VALUE));
            }
        }
    }

    private checkElement(movingElement: MovingCollisionElement, collisionElement: CollisionElement) {
        if(movingElement.detectCollision(collisionElement)) {
            const collision = movingElement.calculateCollision(collisionElement);
            movingElement.fixCollision(collision);
        }
    }
    
    dispose() {
        this.collidingElements = [];
    }
}