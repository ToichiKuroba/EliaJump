export class ColorHandler {
    private _canvas: HTMLCanvasElement;
    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
    }

    get colorMap() : ColorMap {
        const colorMap: ColorMap = {
            "primary-background-color": "",
            "primary-font-color": "",
            "secondary-background-color": "",
            "secondary-font-color": "",
            "success-color": ""
        };

        const style = getComputedStyle(this._canvas);
        Object.keys(colorMap).forEach(key => {
            colorMap[key] = style.getPropertyValue("--" + key);
        });

        return colorMap;
    }   
}

export interface ColorMap {
    [properyName: string]: string,
    "primary-background-color": string;
    "primary-font-color": string,
    "secondary-background-color": string,
    "secondary-font-color": string,
    "success-color": string,
}