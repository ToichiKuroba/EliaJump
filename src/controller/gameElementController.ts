import { GameElement } from "../elements/gameElement";
import { Controller } from "./controller";

export abstract class GameElementController implements Controller {
    constructor(gameElement: GameElement){
        gameElement.addEventListener("Removed", () => this.removeListeners());
    }

    abstract addListeners(): void;
    abstract removeListeners(): void;
    dispose(): void {
        this.removeListeners();
    }

}