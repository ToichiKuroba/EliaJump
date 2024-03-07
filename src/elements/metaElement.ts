import { GameField } from "../gameFlied";
import { GenereicGameElement } from "./gameElement";
import { MetaElementEventMap } from "./gameElementEventMap";
import { GameElementState } from "./gameElementState";

export abstract class MetaElement extends GenereicGameElement<MetaElementEventMap> {
    state: GameElementState = GameElementState.Meta;
    abstract render(gameField: GameField) : void;
    
}