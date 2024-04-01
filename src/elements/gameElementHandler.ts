import { RenderData } from "../render/renderData";
import { RenderElementDatas } from "./renderElementDatas";
import { DomElement } from "./domElement";
import { GameElement } from "./gameElement";
import { AddedElementEvent, GameElementEvent } from "./gameElementEventMap";
import { GameElementState } from "./gameElementState";
import { MetaElement } from "./metaElement";
import { RenderElement, isRenderElement } from "./renderElement";
import { RenderPrio } from "./renderPrio";
import { RenderArea } from "./renderArea";

export class GameElementHandler extends MetaElement {
    private _elements: GameElement[] = [];
    private _renderElements: RenderElement[] = [];
    private _notRenderElements: GameElement[] = [];
    private _metaElements: MetaElement[] = [];
    private _topY = 0;

    get topY() {
        return this._topY;
    }

    protected set topY(value: number) {
        this._topY = value;
    }

    getRenderElementDatas(renderArea: RenderArea): RenderElementDatas {
        const data = new Map<RenderPrio, RenderData[]>();
        let transferables: Transferable[] = [];
        for (let index = 0; index < this._renderElements.length; index++) {
            const element = this._renderElements[index];
            const prio = element.renderPrio;
            if(!element.shouldRender(renderArea)) {
                continue;
            }

            let renderDatas = data.get(prio);
            if (!renderDatas) {
                renderDatas = [];
                data.set(prio, renderDatas);
            }

            const renderData = element.renderData;
            if (renderData) {
                renderDatas.push(renderData);
                if(renderData.transferables.length){ 
                    transferables = [...transferables, ...renderData.transferables];
                }
            }
        }

        let renderElements = [data];
        for (let index = 0; index < this._metaElements.length; index++) {
            const element = this._metaElements[index];
            if (element instanceof GameElementHandler) {
                let data = element.getRenderElementDatas(renderArea);
                renderElements = [...renderElements, ...data.datas];
                transferables = [...transferables, ...data.transferables];
            }
        }

        return { datas: renderElements, transferables: transferables };
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

    showNotRenderElements(): void {
        for (let index = 0; index < this._metaElements.length; index++) {
            const metaElement = this._metaElements[index];
            metaElement.showNotRenderElements();
        }

        for (let index = 0; index < this._notRenderElements.length; index++) {
            const element = this._notRenderElements[index];
            if (element.state == GameElementState.Active || element.state == GameElementState.Inactive) {
                if (element instanceof DomElement) {
                    element.refresh();
                }
            }
        }
    }

    calculateNextFrame(): void {
        this._renderElements = [];
        this._metaElements = [];
        this._notRenderElements = [];
        this._topY = 0;
        for (let index = this._elements.length - 1; index >= 0; index--) {
            const element = this._elements[index];
            if (element instanceof MetaElement) {
                this._metaElements.push(element);
                element.calculateNextFrame();
            }
            else {
                if (element.state == GameElementState.Active) {
                    element.calculateNextFrame();
                }
                else if (element.state == GameElementState.Removed) {
                    element.dispose();
                }

                if (isRenderElement(element)) {
                    this._renderElements.push(element);
                } else {
                    this._notRenderElements.push(element);
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