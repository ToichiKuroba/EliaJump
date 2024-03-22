import { GameField } from "../gameFlied";
import { iterateEnum } from "../util/iterateEnum";
import { DomElement } from "./domElement";
import { GameElement } from "./gameElement";
import { AddedElementEvent, GameElementEvent } from "./gameElementEventMap";
import { GameElementState } from "./gameElementState";
import { MetaElement } from "./metaElement";
import { isRenderElement } from "./renderElement";
import { RenderPrio } from "./renderPrio";

export class GameElementHandler extends MetaElement {
    private _elements: GameElement[] = [];
    private _priotizedElements = new Map<RenderPrio, GameElement[]>();
    private _metaElements: MetaElement[] = [];
    private _topY = 0;

    get topY() {
        return this._topY;
    }

    handleResize(heightChange: number) {
        for (let index = this._elements.length - 1; index >= 0; index--) {
            const element = this._elements[index];

            if (element instanceof GameElementHandler) {
                element.handleResize(heightChange);
            }
            else if (isRenderElement(element)) {
                element.handleResize(heightChange);
            }
        }
    }

    subElementInitialize() {
        for (let index = 0; index < this._elements.length; index++) {
            const element = this._elements[index];
            if (element instanceof GameElementHandler) {
                element.subElementInitialize();
            }
        }
    }

    render(gameField: GameField): void {
        iterateEnum(RenderPrio).forEach((enumValue) => {
            this.renderElements(gameField, enumValue as RenderPrio);
        });
    }

    renderElements(gameField: GameField, prioToRender: RenderPrio): void {
        for (let index = 0; index < this._metaElements.length; index++) {
            const metaElement = this._metaElements[index];
            metaElement.renderElements(gameField, prioToRender);
        }

        var renderElementsInPrio = this._priotizedElements.get(prioToRender) ?? [];
        for (let index = 0; index < renderElementsInPrio.length; index++) {
            const element = this._elements[index];
            if (element.state == GameElementState.Active || element.state == GameElementState.Inactive) {
                if (isRenderElement(element)) {
                    gameField.render(element);
                }else if(element instanceof DomElement) {
                    element.refresh();
                }
            }
        }
    }

    calculateNextFrame(): void {
        this._priotizedElements.clear();
        this._metaElements = [];
        for (let index = this._elements.length - 1; index >= 0; index--) {
            const element = this._elements[index];
            if (element instanceof MetaElement) {
                this._metaElements.push(element);
                element.calculateNextFrame();
            }
            else {
                let prio = RenderPrio.normal;
                if (isRenderElement(element)) {
                    prio = element.renderPrio;
                }

                let renderElements = this._priotizedElements.get(prio);
                if (!renderElements) {
                    renderElements = [];
                    this._priotizedElements.set(prio, renderElements);
                }

                renderElements.push(element);

                if (element.state == GameElementState.Active) {
                    element.calculateNextFrame();
                }
                else if (element.state == GameElementState.Removed) {
                    element.dispose();
                }
            }

            if (isRenderElement(element) && element.y < this._topY) {
                this._topY = element.y;
            } else if (element instanceof GameElementHandler && element.topY < this._topY) {
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

        if (element instanceof MetaElement) {
            element.addEventListener("Added", (ev) => {
                this.dispatchEvent(new AddedElementEvent(ev.element, ev.sender));
            });
        }
    }

    private elementRemovedHandler = (ev: GameElementEvent<"Removed">) => {
        this._elements = this._elements.filter(e => e != ev.sender);
        ev.sender.removeEventListener("Removed", this.elementRemovedHandler);
        this.dispatchEvent(new GameElementEvent<"Removed">("Removed", ev.sender));
    }
}