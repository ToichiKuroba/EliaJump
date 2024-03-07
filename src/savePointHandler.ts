import { Figure } from "./figure";
import { SavePoint } from "./savePoint";

export class SavePointHandler {
    private readonly _player: Figure;
    private _savePoints: SavePoint[];
    private _reachedSavePoints: SavePoint[];
    constructor(player: Figure, savePoints: SavePoint[]) {
        this._player = player;
        this._savePoints = savePoints;
        this._reachedSavePoints = [];
        document.addEventListener("keypress", (ev) => {
            if (ev.key == "r") {
                this.returnToSavePoint();
            }
        });
    }

    checkSavePoint() {
        if (this._player.canSave()) {
            const savePointIndex = this._savePoints.findIndex(savePoint => savePoint.y > this._player.y);
            const savePoint = this._savePoints[savePointIndex];
            if (savePoint) {
                this._reachedSavePoints.push(savePoint);
                this._savePoints.splice(savePointIndex, 1);
            }
        }
    }

    returnToSavePoint() {
        const lastSavePoint = this._reachedSavePoints[this._reachedSavePoints.length-1];
        if (lastSavePoint && this._player.y > lastSavePoint.y) {
            this._player.goToSavePoint(lastSavePoint);
        }
    }

    dispose() {
        this._savePoints = [];
        this._reachedSavePoints = [];
    }
}