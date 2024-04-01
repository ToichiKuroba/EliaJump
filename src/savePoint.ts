export class SavePoint{
    private readonly _element : SavePointElement;
    private readonly _id: string;
    private readonly _name: string;

    
    get name(): string {
        return this._name;
    }

    get id() {
        return this._id;
    }

    get x(){
        return this._element.x;
    }

    get y(){
        return this._element.y;
    }

    set reached(isReached: boolean) {
        this._element.isReached = isReached;
    }

    constructor(id: string, name: string, element : SavePointElement) {
        this._element = element;
        this._id = id;
        this._name = name;
    }
}

export interface SavePointElement {
    get x(): number;
    get y(): number;
    set isReached(reached: boolean);
}