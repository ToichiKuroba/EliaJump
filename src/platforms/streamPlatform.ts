import { Platform } from "./platform";
import { Stream } from "../util/stream";
import { RenderMap } from "../render/renderMap";
import { RenderData } from "../render/renderData";
import { StreamPlatformRenderData } from "./streamPlatformRender";

export class StreamPlatform extends Platform {
    private _stream: Stream;

    protected get rendererKey(): keyof RenderMap {
        return "StreamPlatform";
    }

    get renderData(): RenderData {
        return {...super.renderData, stream: this._stream} as StreamPlatformRenderData
    }
    
    constructor(stream: Stream, x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this._stream = stream;
    }

}