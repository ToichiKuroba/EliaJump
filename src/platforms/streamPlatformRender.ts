import { RenderData } from "../render/renderData";
import { TypedRenderer } from "../render/renderer";
import { Stream } from "../util/stream";
import { PlatformRender } from "./platformRender";

export interface StreamPlatformRenderData extends RenderData {
    stream: Stream,
}

export class StreamPlatformRender extends TypedRenderer<StreamPlatformRenderData> {
    private _platformRender: PlatformRender;

    constructor(platformRender: PlatformRender) {
        super();
        this._platformRender = platformRender;
    }

    private normalizeTitle(stream: Stream) {
        return stream.title.replace(/【.*】/g, "");
    }

    private getStreamTime(stream: Stream) {
        return stream.liveStreamDate.toLocaleTimeString(undefined, { timeZone: "GMT", timeStyle: "short" });
    }

    private getWeekday(stream: Stream) {
        return stream.liveStreamDate.toLocaleDateString('en-us', { weekday: "short" }).toUpperCase();
    }

    private breakText(words: string[], breakIndex: number): [line1: string, line2: string] {
        let tileLine1 = "";
        let tileLine2 = "";
        for (let index = 0; index < words.length; index++) {
            if (index < breakIndex) {
                tileLine1 += " " + words[index];
            }
            else {
                tileLine2 += " " + words[index];
            }
        }

        return [tileLine1, tileLine2];
    }


    protected _render(context: OffscreenCanvasRenderingContext2D, renderData: StreamPlatformRenderData): void {
        const baseX = renderData.x + 20;
        const baseY = renderData.y + 10;
        this._platformRender.render(context, renderData);
        const paddingTopBottom = 20;
        const fontSize = (renderData.height - paddingTopBottom * 2) / 2;
        const baseWidth = renderData.width - fontSize - 20;
        context.fillStyle = "#000";
        context.font = fontSize + "px arial";
        const streamTime = this.getStreamTime(renderData.stream);
        const measure = context.measureText(streamTime);
        const paddingRight = measure.width + 10;
        const maxTitleWidth = baseWidth - paddingRight - 10;
        const normalizedTitle = this.normalizeTitle(renderData.stream);
        let titleMeasure = context.measureText(normalizedTitle);
        const words = normalizedTitle.split(" ");
        let breakIndex = words.length - 1;
        let titleLine1 = normalizedTitle;
        let titleLine2 = "";
        while (titleMeasure.width > maxTitleWidth && breakIndex > 0) {
            [titleLine1, titleLine2] = this.breakText(words, breakIndex);
            titleMeasure = context.measureText(titleLine1);
            breakIndex--;
        }

        const title2Measure = context.measureText(titleLine2);
        if (title2Measure.width > maxTitleWidth) {
            [titleLine1, titleLine2] = this.breakText(words, words.length / 2);
        }

        const y = baseY + paddingTopBottom;
        const secondLineY = y + fontSize + 5;
        const titleX = baseX + fontSize;

        context.save();
        context.textAlign = 'right';
        context.translate(baseX, y - 10);
        context.rotate(-Math.PI / 2);
        context.fillText(this.getWeekday(renderData.stream), 0, 0, renderData.height);
        context.restore();

        context.fillText(titleLine1, titleX, y, maxTitleWidth);
        if (titleLine2.length) {
            context.fillText(titleLine2, titleX, secondLineY, maxTitleWidth);
        }
        context.fillText(streamTime, titleX + baseWidth - paddingRight, y, baseWidth - paddingRight);
        context.fillText("GMT", titleX + baseWidth - paddingRight, secondLineY, baseWidth - paddingRight);
    }

}