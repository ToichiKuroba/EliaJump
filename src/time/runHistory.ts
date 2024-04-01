import { Run, isRun } from "./run";

function isDatabase(value: any): value is IDBDatabase {
    return typeof (value as IDBDatabase)?.transaction === "function";
}

export class RunHistoryImpl implements RunHistory {
    private static DBName = "RunHistory";
    private static DBVersion = 2;
    private static RunsObjectStoreName = "runs";
    private static FinishedIndexName = "finished";
    private static FinishTimestampIndexName = "finishTimestamp";
    private _db: Promise<IDBDatabase>;
    constructor() {
        const request = indexedDB.open(RunHistoryImpl.DBName, RunHistoryImpl.DBVersion);
        this._db = new Promise((resolve, reject) => {
            request.onerror = (event) => {
                if (event.target && "errorCode" in event.target) {
                    console.error(`Database error: ${event.target.errorCode}`);
                }
                else {
                    console.error("Database error");
                }

                reject();
            };

            request.onsuccess = (event) => {
                if (event.target && "result" in event.target && isDatabase(event.target.result)) {
                    resolve(event.target.result);
                }
                else {
                    console.error("Database error: Parsing DB Instance");
                    reject();
                }
            }
        });

        request.onupgradeneeded = (event) => {
            if (event.target && "result" in event.target && isDatabase(event.target.result)) {
                const db = event.target.result;
                let runsObjectStore;
                if(event.oldVersion >= 1){
                    db.deleteObjectStore(RunHistoryImpl.RunsObjectStoreName);
                }

                runsObjectStore = db.createObjectStore(RunHistoryImpl.RunsObjectStoreName, { keyPath: "id" });
                runsObjectStore.createIndex(RunHistoryImpl.FinishedIndexName, "finished", { unique: false });
                runsObjectStore.createIndex(RunHistoryImpl.FinishTimestampIndexName, "finishTimestamp", { unique: false });
            }
            else {
                console.error("Database error: Parsing DB Instance");
            }
        }
    }

    saveRun(run: Run): Promise<void> {
        return new Promise((resolve, reject) => {
            this._db.then(db => {
                const transaction = db.transaction(RunHistoryImpl.RunsObjectStoreName, "readwrite");
                transaction.oncomplete = (ev) => resolve();
                transaction.onerror = (ev) => reject(ev.target);
                transaction.objectStore(RunHistoryImpl.RunsObjectStoreName).add(run);
            });
        });

    }

    getLatestRun() : Promise<Run> {
        return new Promise<Run>((resolve, reject) => {
            this._db.then(db => {
                const transaction = db.transaction(RunHistoryImpl.RunsObjectStoreName, "readonly");
                transaction.onerror = (ev) => reject(ev.target);
                transaction.objectStore(RunHistoryImpl.RunsObjectStoreName).openCursor(null, "prev").onsuccess = function (event) {
                    if (!event || !event.target || !("result" in event.target) || !event.target.result) {
                        console.error("Database error: opening getLatestRun cursor failed.");
                        return;
                    }

                    const cursor = event.target.result as IDBCursorWithValue;
                    if (cursor && isRun(cursor.value)) {
                        resolve(cursor.value);
                    }
                };
            }).catch(reason => reject(reason));
        });
    }

    getRuns(finished?: boolean): Promise<Run[]> {
        return new Promise<Run[]>((resolve, reject) => {
            this._db.then(db => {
                const runs: Run[] = [];

                const keyRange = finished !== undefined ? IDBKeyRange.only(finished) : undefined;
                const transaction = db.transaction(RunHistoryImpl.RunsObjectStoreName, "readonly");
                transaction.oncomplete = (ev) => resolve(runs);
                transaction.onerror = (ev) => reject(ev.target);
                transaction.objectStore(RunHistoryImpl.RunsObjectStoreName).openCursor(keyRange).onsuccess = (event) => {
                    if (!event || !event.target || !("result" in event.target) || !event.target.result) {
                        console.error("Database error: opening loadRuns cursor failed.");
                        return;
                    }

                    const cursor = event.target.result as IDBCursorWithValue;
                    if (cursor && isRun(cursor.value)) {
                        runs.push(cursor.value);
                    }

                    cursor.continue();
                }
            }).catch(reason => reject(reason));
        });
    }
}

export interface RunHistory {
    getRuns(finished?: boolean): Promise<Run[]>;
    saveRun(run: Run): Promise<void>;
    getLatestRun() : Promise<Run>;
}
