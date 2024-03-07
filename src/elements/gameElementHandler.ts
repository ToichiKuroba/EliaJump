import { GameField } from "../gameFlied";
import { DomElement } from "./domElement";
import { GameElement } from "./gameElement";
import { AddedElementEvent, GameElementEvent } from "./gameElementEventMap";
import { GameElementState } from "./gameElementState";
import { MetaElement } from "./metaElement";
import { RenderElement } from "./renderElement";

export class GameElementHandler extends MetaElement {
    private _elements: GameElement[] = [];
    private _topY = 0;

    get topY() {
        return this._topY;
    }

    handleResize(heightChange: number) {
        for (let index = this._elements.length - 1; index >= 0; index--) {
            const element = this._elements[index];

            if(element instanceof GameElementHandler) {
                element.handleResize(heightChange);
            }
            else if(element instanceof RenderElement) {
                element.handleResize(heightChange);
            } 
        }
    }

    subElementInitialize() {
        for (let index = 0; index < this._elements.length; index++) {
            const element = this._elements[index];
            if(element instanceof GameElementHandler) {
                element.subElementInitialize();
            }
        }
    }

    render(gameField: GameField): void {
        for (let index = 0; index < this._elements.length; index++) {
            const element = this._elements[index];
            if(element instanceof MetaElement) {
                element.render(gameField);
            }
            else if(element.state == GameElementState.Active || element.state == GameElementState.Inactive) {
                if(element instanceof RenderElement){
                    gameField.render(element);
                }else if(element instanceof DomElement){
                   element.refresh();  
                }
            }
        }
    }

    calculateNextFrame(): void {
        for (let index = this._elements.length - 1; index >= 0; index--) {
            const element = this._elements[index];

            if(element instanceof MetaElement) {
                element.calculateNextFrame();
            }
            else if(element.state == GameElementState.Active) {
                element.calculateNextFrame();
            } 
            else if(element.state == GameElementState.Removed) {
                element.dispose();
            }

            if(element instanceof RenderElement && element.y < this._topY){
                this._topY = element.y;
            } else if(element instanceof GameElementHandler && element.topY < this._topY) {
                this._topY = element._topY;
            }
        }
    }

    dispose(): void {

        for (let index = 0; index < this._elements.length; index++) {
            const element = this._elements[index];
            element.removeEventListener("Removed", this.elementRemovedHandler);
            element.dispose();
        }

        this._elements = [];
    }

    add(element: GameElement) {
        this._elements.push(element);
        this.distributeEvents(element);
        this.dispatchEvent(new AddedElementEvent(element, this));
    }

    distributeEvents(element: GameElement) {
        element.addEventListener("Removed", this.elementRemovedHandler);

        if(element instanceof MetaElement) {    
            element.addEventListener("Added", (ev) => {
                this.dispatchEvent(new AddedElementEvent(ev.element, ev.sender));
            });
        }
    }

    private elementRemovedHandler = (ev : GameElementEvent<"Removed">) => {
        this._elements = this._elements.filter(e => e != ev.sender);
        ev.sender.removeEventListener("Removed", this.elementRemovedHandler);
        this.dispatchEvent( new GameElementEvent<"Removed">("Removed", ev.sender));
    }
}