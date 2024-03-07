import { GameElementEventMap, GameElementEvent } from "./gameElementEventMap";
import { GameElementState } from "./gameElementState";

export interface GameElement {
    state: GameElementState;
    calculateNextFrame() : void;

    addEventListener<K extends keyof GameElementEventMap>(type: K, listener: (this: GameElement, ev: GameElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions) : void;

    removeEventListener<K extends keyof GameElementEventMap>(type: K, listener: {(this: GameElement,ev: GameElementEventMap[K]): any} | null, options?: boolean | EventListenerOptions) : void;

    dispatchEvent<K extends keyof GameElementEventMap>(event: GameElementEventMap[K]): boolean;

    dispose() : void;
}

export abstract class GenereicGameElement<EventMap extends GameElementEventMap> implements GameElement {
    private eventTarget = new EventTarget();
    abstract state: GameElementState;
    abstract calculateNextFrame() : void;
    abstract dispose() : void;
    
    addEventListener<K extends keyof EventMap>(type: K, listener: (this: GenereicGameElement<EventMap>, ev: EventMap[K]) => any, options?: boolean | AddEventListenerOptions) : void {
        this.eventTarget.addEventListener(type as string, listener as (this: GenereicGameElement<EventMap>, ev : Event) => void, options);
    }

    removeEventListener<K extends keyof EventMap>(type: K, listener: {(this: GenereicGameElement<EventMap>, ev: EventMap[K]): any} | null, options?: boolean | EventListenerOptions) {
        this.eventTarget.removeEventListener(type as string, listener as (this: GenereicGameElement<EventMap>, ev : Event) => void, options);
    }

    dispatchEvent<K extends keyof EventMap>(event: EventMap[K]): boolean {
        return this.eventTarget.dispatchEvent(event as Event);
    }
}


export abstract class DefaultGameElement extends GenereicGameElement<GameElementEventMap>{
    dispose() {
        this.dispatchEvent(new GameElementEvent("Removed", this));
    }
}
