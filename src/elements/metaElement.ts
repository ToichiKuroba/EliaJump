import { GameField } from "../gameFlied";
import { GenereicGameElement } from "./gameElement";
import { MetaElementEventMap } from "./gameElementEventMap";
import { GameElementState } from "./gameElementState";
import { RenderPrio } from "./renderPrio";

export abstract class MetaElement extends GenereicGameElement<MetaElementEventMap> {
    state: GameElementState = GameElementState.Meta;
    abstract renderElements(gameField: GameField, prioToRender: RenderPrio) : void;
}