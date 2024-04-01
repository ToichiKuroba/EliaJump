import { Run } from "./run";
import { RunHistory } from "./runHistory";
import { TimeHandler } from "./time";
import { TimeSnapshot } from "./timeSnapshot";


export interface RunHandler {
    saveSnapshot(id: string, name: string): void;
    endRun(finished: boolean): Run;
    get isRunning() : boolean;
    start(): void;
    get currentTime(): number;
    getLatestRun(): Promise<Run>;
}

export class RunHandlerImpl implements RunHandler {    
    private static SnapshortsKey = "timeSnapshorts";
    private _currentSnapshots: TimeSnapshot[];
    private _timeHandler: TimeHandler;
    private _runHistory: RunHistory;
    constructor(timeHandler: TimeHandler, runHistory: RunHistory) {
        this._timeHandler = timeHandler;
        const storage = localStorage.getItem(RunHandlerImpl.SnapshortsKey);
        this._currentSnapshots = storage ? JSON.parse(storage) as TimeSnapshot[] : [];
        this._runHistory = runHistory;
    }
    getLatestRun(): Promise<Run> {
        return this._runHistory.getLatestRun();
    }
    get isRunning(): boolean {
        return this._timeHandler.isRunning;
    }
    get currentTime(): number {
        return this._timeHandler.time;
    }

    saveSnapshot(id: string, name: string): void {
        this._currentSnapshots.push({ id, name, time: this._timeHandler.time });
        localStorage.setItem(RunHandlerImpl.SnapshortsKey, JSON.stringify(this._currentSnapshots));
    }

    endRun(finished: boolean): Run {
        const time = this._timeHandler.endTime();
        const finishTimestamp = Date.now();
        const run: Run = {
            id: finishTimestamp.toString(),
            finishTimestamp: finishTimestamp,
            finalTime: time,
            finished,
            snapshots: this._currentSnapshots
        };
        
        this._runHistory.saveRun(run);
        this.reset();
        return run;
    }

    start(): void {
        this._timeHandler.start();
    }

    private reset() {
        this._currentSnapshots = [];
        localStorage.removeItem(RunHandlerImpl.SnapshortsKey);
    }
}

