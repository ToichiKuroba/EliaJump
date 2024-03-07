export class Timer {
    private passedTime: number = 0;
    private startTimestamp: number = 0;

    get isRunning() {
        return this.startTimestamp;
    }

    get millseconds() {
        return this.passedTime + (this.startTimestamp ? (Date.now() - this.startTimestamp) : 0);
    }

    Start() {
        this.startTimestamp = Date.now();
    }

    Stop(){
        if(this.startTimestamp) {
            const nowMs = Date.now();
            this.passedTime += (nowMs - this.startTimestamp);
            this.startTimestamp = 0;
        }
    }

    Reset() {
        this.passedTime = 0;
        if(this.isRunning) {
            this.Start();   
        }
    }
}
