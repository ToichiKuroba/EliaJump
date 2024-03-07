export class CollisionBox {
    constructor(xStart: number,
        yStart: number,
        xEnd: number,
        yEnd: number) {
        this.xStart = xStart;
        this.yStart = yStart;
        this.xEnd = xEnd;
        this.yEnd = yEnd;
    }
    xStart: number;
    xEnd: number;
    yStart: number;
    yEnd: number;
    dimensionsInside(box: CollisionBox) {
        const xStartInside = this.xStart < box.xStart && this.xEnd > box.xStart;
        const xEndInside = this.xStart < box.xEnd && this.xEnd > box.xEnd;
        const yStartInside = this.yStart < box.yStart && this.yEnd > box.yStart;
        const yEndInside = this.yStart < box.yEnd && this.yEnd > box.yEnd;

        return {
            xStartInside,
            xEndInside,
            yStartInside,
            yEndInside
        }
    }
}