import { TypedEvent } from "../util/typedEvent";
import { GameElement } from "./gameElement";
import { MetaElement } from "./metaElement";

export class GameElementEvent<K extends keyof GameElementEventMap> extends TypedEvent<GameElementEventMap, K> {
    sender: GameElement;
    constructor(type: K, sender: GameElement, eventInitDict?: EventInit) {
        super(type, eventInitDict);
        this.sender = sender;
    }
}

export class MetaElementEvent<K extends keyof MetaElementEventMap> extends TypedEvent<MetaElementEventMap, K> {
    sender: MetaElement;
    constructor(type: K, sender: MetaElement, eventInitDict?: EventInit) {
        super(type, eventInitDict);
        this.sender = sender;
    }
}

export class AddedElementEvent extends MetaElementEvent<"Added"> {
    constructor(element: GameElement, sender: MetaElement) {
        super("Added", sender);
        this.element = element;
    }

    element: GameElement
}

export interface GameElementEventMap {
    "Removed": GameElementEvent<"Removed">;
    "PauseListeners": GameElementEvent<"PauseListeners">;
    "ResumeListeners": GameElementEvent<"ResumeListeners">;
}

export interface MetaElementEventMap extends GameElementEventMap {
    "Added": AddedElementEvent;
}
