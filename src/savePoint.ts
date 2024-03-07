export class SavePoint{
    private _x: number;
    private _y: number;
    
    get x(){
        return this._x;
    }

    get y(){
        return this._y;
    }

    constructor(x : number, y : number) {
        this._x = x;
        this._y = y;
    }

    
}