import { RenderElementDatas } from "./renderElementDatas";
import { GenereicGameElement } from "./gameElement";
import { MetaElementEventMap } from "./gameElementEventMap";
import { GameElementState } from "./gameElementState";
import { RenderArea } from "./renderArea";

export abstract class MetaElement extends GenereicGameElement<MetaElementEventMap> {
    state: GameElementState = GameElementState.Meta;
    abstract getRenderElementDatas(renderArea: RenderArea): RenderElementDatas;
    abstract showNotRenderElements(): void;
}