import { Figure } from "./figure";
import { SavePoint } from "./savePoint";
import { SavePointProvider } from "./savePointProvider";
import { RunHandler } from "./time/runHandler";

export class SavePointHandler {
    private static STORAGE_KEY = "SavePoints";
    private readonly _player: Figure;
    private _savePoints: Map<string, SavePoint>;
    private _reachedSavePoints: string[];
    private _notReachedSavePoints: string[];
    private _savePointProvider: SavePointProvider;
    private readonly _runHandler: RunHandler;
    constructor(player: Figure, savePointProvider: SavePointProvider, runHandler: RunHandler) {
        this._player = player;
        this._savePoints = new Map<string, SavePoint>();
        const storage = localStorage.getItem(SavePointHandler.STORAGE_KEY);
        this._reachedSavePoints = storage ? JSON.parse(storage) as string[] : [];
        this._notReachedSavePoints = [];
        this._savePointProvider = savePointProvider;
        this._savePointProvider.onSavePointsProvided = savePoints => this.savePoints = savePoints;
        this._runHandler = runHandler;
    }

    set savePoints(savePoints: SavePoint[]) {
        this._savePoints.clear();
        this._notReachedSavePoints = [];
        for (let index = 0; index < savePoints.length; index++) {
            const savePoint = savePoints[index];
            if (this._reachedSavePoints.indexOf(savePoint.id) < 0) {
                this._notReachedSavePoints.push(savePoint.id);
            }else {
                savePoint.reached = true;
            }

            this._savePoints.set(savePoint.id, savePoint);
        }
    }

    checkSavePoint() {
        if (this._player.canSave()) {
            for (let savePointIndex = this._notReachedSavePoints.length - 1; savePointIndex >= 0; savePointIndex--) {
                const savePointId = this._notReachedSavePoints[savePointIndex];
                const savePoint = this._savePoints.get(savePointId);
                if (savePoint && savePoint.y > this._player.y) {
                    savePoint.reached = true;
                    this._runHandler.saveSnapshot(savePoint.id, savePoint.name);
                    this._reachedSavePoints.push(savePointId);
                    this._notReachedSavePoints.splice(savePointIndex, 1);
                    this.saveReachedSavePoints();
                }
            }
        }
    }

    returnToSavePoint() {
        let lastSavePoint:SavePoint|null = null;

        for (let index = 0; index < this._reachedSavePoints.length; index++) {
            const savePointId = this._reachedSavePoints[index];
            const savePoint = this._savePoints.get(savePointId);
            if(savePoint && (!lastSavePoint || lastSavePoint.y > savePoint.y)) {
                lastSavePoint = savePoint;
            }
        }

        if (lastSavePoint && this._player.y > lastSavePoint.y) {
            this._player.goToSavePoint(lastSavePoint);
        }
    }

    saveReachedSavePoints() {
        localStorage.setItem(SavePointHandler.STORAGE_KEY, JSON.stringify(this._reachedSavePoints));
    }

    deleteSavePoints() {
        localStorage.removeItem(SavePointHandler.STORAGE_KEY);
        this.resetSavePoints();
    }

    private resetSavePoints() {
        this._savePoints.forEach(savePoint => savePoint.reached = false);
        this._notReachedSavePoints = [...this._reachedSavePoints, ...this._notReachedSavePoints];
        this._reachedSavePoints = [];
    }

    dispose() {
        this.resetSavePoints();
        this._savePoints = new Map<string, SavePoint>();
        this._notReachedSavePoints = [];
        this._reachedSavePoints = [];
    }
}