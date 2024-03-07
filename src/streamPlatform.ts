import { Platform } from "./platform";
import { Stream } from "./util/stream";

export class StreamPlatform extends Platform {
    private _stream: Stream;
    constructor(stream: Stream, x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this._stream = stream;
        
    }

private get _normalizedTitle() {
    return this._stream.title.replace(/【.*】/g, "");
}

private get _streamTime() {
    return this._stream.liveStreamDate.toLocaleTimeString(undefined, {timeZone: "GMT", timeStyle: "short"});
}

private get _weekday() {
    return this._stream.liveStreamDate.toLocaleDateString('en-us', {weekday: "short"}).toUpperCase();
}

    render(context: CanvasRenderingContext2D): void {
        const baseX = this.x + 20;
        const baseY = this.y + 10;
        super.render(context);
        const paddingTopBottom = 20;
        context.fillStyle = "#000";  
        const fontSize = (this.height - paddingTopBottom * 2) / 2;
        const baseWidth = this._width - fontSize - 20;
        context.font = fontSize + "px arial";
        const measure = context.measureText(this._streamTime);
        const paddingRight = measure.width + 10;
        const maxTitleWidth = baseWidth - paddingRight - 10;
        let titleMeasure = context.measureText(this._normalizedTitle);
        const words = this._normalizedTitle.split(" ");
        let breakIndex = words.length - 1;
        let titleLine1 = this._normalizedTitle;
        let titleLine2 = "";
        while(titleMeasure.width > maxTitleWidth && breakIndex > 0) {
            [titleLine1, titleLine2] = this.breakText(words, breakIndex);
            titleMeasure = context.measureText(titleLine1);
            breakIndex--;
            if(titleMeasure.width <= maxTitleWidth) {
                const title2Measure = context.measureText(titleLine1);
                if(title2Measure.width > maxTitleWidth) {
                    [titleLine1, titleLine2] = this.breakText(words, words.length / 2);
                }
            }
        }

        const y = baseY + paddingTopBottom;
        const secondLineY = y + fontSize + 5;
        const titleX = baseX + fontSize;

        context.save();
        context.textAlign = 'right';
        context.translate(baseX, y - 10);
        context.rotate(-Math.PI / 2);
        context.fillText(this._weekday, 0, 0, this.height);
        context.restore();

        context.fillText(titleLine1, titleX, y, maxTitleWidth);
        if(titleLine2.length) {
            context.fillText(titleLine2, titleX, secondLineY, maxTitleWidth);
        }
        context.fillText(this._streamTime, titleX + baseWidth - paddingRight, y, baseWidth - paddingRight);
        context.fillText("GMT", titleX + baseWidth - paddingRight, secondLineY, baseWidth - paddingRight);
    }

    private breakText(words: string[], breakIndex: number) : [line1: string, line2: string] {
        let tileLine1 = "";
        let tileLine2  = "";
        for (let index = 0; index < words.length; index++) {
            if(index < breakIndex) {
                tileLine1 += " " + words[index];
            }
            else {
                tileLine2 += " " + words[index];
            }
        }

        return [tileLine1, tileLine2];
    }
}