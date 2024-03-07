export interface FocusElement {
    get y() : number;
    get x() : number;
    get height(): number;
    canFocus() : boolean;
    shouldRender(renderAreaXStart: number, renderAreaYStart: number, renderAreaXEnd: number, renderAreaYEnd: number) : boolean;
}