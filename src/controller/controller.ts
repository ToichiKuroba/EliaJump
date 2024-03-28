import { Controlls } from "../controlls";
import { Figure } from "../figure";

export interface Controller {
    addListeners(): void;
    removeListeners(): void;
    dispose(): void;
}
