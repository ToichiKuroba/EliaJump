import { TimeSnapshot } from "./timeSnapshot";

export function isRun(value: any) : value is Run {
    const run = value as Run;
    return run && run.finalTime !== undefined && run.finished !== undefined && run.snapshots !== undefined && run.snapshots.length !== undefined;
}

export interface Run {
    id: string;
    finishTimestamp: number;
    finished: boolean;
    snapshots: TimeSnapshot[];
    finalTime: number;
}
