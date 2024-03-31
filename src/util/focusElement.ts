export interface FocusElement {
    get y() : number;
    get x() : number;
    get height(): number;
    canFocus() : boolean;
}