import { RenderPrio } from "./elements/renderPrio";
import { RenderContext } from "./render/renderContext";
import { RenderData } from "./render/renderData";
import { RenderMap } from "./render/renderMap";
import { iterateEnum } from "./util/iterateEnum";
import { AsyncRenderer } from "./workers/asyncRender";
import { AsyncRenderData } from "./workers/asyncRenderData";

interface ClearedArea {
    yStart: number,
    yEnd: number,
}

export class OffscreenRenderer implements AsyncRenderer {
    private static BufferY = 100;
    private static BufferX = 50;
    private _canvas: OffscreenCanvas;
    private _context: OffscreenCanvasRenderingContext2D | null;
    private _renderMap: RenderMap;
    private _dpr: number = 1;
    private _clearedAreas: ClearedArea[] = [];
    private _fullRerender = true;
    constructor(canvas: OffscreenCanvas, renderMap: RenderMap) {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");
        this._renderMap = renderMap;
    }

    get bottom() {
        return this._canvas.height / this._dpr;
    }

    get width() {
        return this._canvas.width / this._dpr;
    }

    get viewHeight() {
        return this._canvas.height / this._dpr;
    }

    adjustSize(widthAdjustment: number, heightAdjustment: number, dpr: number, yTranslation: number) {
        this._dpr = dpr;
        if (heightAdjustment != 0) {
            this._canvas.height += heightAdjustment;
        }

        if (widthAdjustment != 0) {
            this._canvas.width += widthAdjustment;
        }

        if (heightAdjustment != 0 && widthAdjustment != 0 && this._context) {
            this._context.scale(dpr, dpr);
            this.translateScreen(this._context, 0, yTranslation);
            this._fullRerender = true;
        }
    }

    renderFrame(data: AsyncRenderData): void {
        this._clearedAreas = [];
        if (this._context) {
            this.translateScreen(this._context, data.prevYTranslation, data.yTranslation);
            this.renderPriorities({drawContext: this._context, colorMap: data.colorMap}, data.renderData);
        }
    }

    renderPriorities(context: RenderContext, renderData: Map<RenderPrio, RenderData[]>[]) {

        let renderer: (() => void)[] = [];
        iterateEnum(RenderPrio).forEach(prio => {
            for (let index = 0; index < renderData.length; index++) {
                const element = renderData[index];
                const prioElements = element.get(prio);
                if (prioElements) {
                    renderer = [...renderer, ...this.renderElements(context, prioElements)];
                }
            }
        });

        for (let index = 0; index < renderer.length; index++) {
            const render = renderer[index];
            render();
        }

        this._fullRerender = false;
    }

    renderElements(context: RenderContext, renderData: RenderData[]): (() => void)[] {
        let rtn: (() => void)[] = [];
        for (let index = 0; index < renderData.length; index++) {
            rtn.push(this.render(context, renderData[index]));
        }

        return rtn;
    }

    render(context: RenderContext, renderData: RenderData): (() => void) {
        const render = this._renderMap[renderData.rendererKey];
        if (renderData.needsRerender && renderData.prevRenderData) {
            this.clearArea(context.drawContext, renderData.prevRenderData.y, renderData.prevRenderData.height);
        }
        return () => {
            if (renderData.needsRerender || this.isInClearedArea(renderData) || !renderData.prevRenderData) {
                render.render(context, renderData);
            }
        }
    }

    isInClearedArea(renderData: RenderData) {
        if(this._fullRerender) {
            return true;
        }

        for (let index = 0; index < this._clearedAreas.length; index++) {
            const clearedArea = this._clearedAreas[index];
            const yEnd = renderData.y + renderData.height;
            if ((renderData.y >= clearedArea.yStart && renderData.y <= clearedArea.yEnd)
                || (yEnd >= clearedArea.yStart && yEnd <= clearedArea.yEnd)
                || (renderData.y <= clearedArea.yStart && yEnd >= clearedArea.yEnd)) {
                return true;
            }
        }
    }

    clearScreen(context: OffscreenCanvasRenderingContext2D, yTranslation: number) {
        const height = this.viewHeight + OffscreenRenderer.BufferY;
        const yStart = -(yTranslation + OffscreenRenderer.BufferY);
        const yEnd = yStart + height;
        this._clearedAreas.push({
            yStart,
            yEnd
        });

        context.clearRect(-OffscreenRenderer.BufferX, yStart, this.width + OffscreenRenderer.BufferX, height);
    }

    clearArea(context: OffscreenCanvasRenderingContext2D, yStart: number, height: number) {
        const yEnd = yStart + height;
        this._clearedAreas.push({
            yStart,
            yEnd
        });

        context.clearRect(-OffscreenRenderer.BufferX, yStart, this.width + OffscreenRenderer.BufferX, height);
    }

    translateScreen(context: OffscreenCanvasRenderingContext2D, prevYTranslation: number, yTranslation: number) {
        if (prevYTranslation != yTranslation) {
            context.translate(0, -prevYTranslation);
            context.translate(0, yTranslation);
            this.clearScreen(context, yTranslation);
        }
    }
}