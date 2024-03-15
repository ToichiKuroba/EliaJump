
export class AxisLine {
    maxPoint: number;
    minPoint: number;

    constructor(minPoint: number, maxPoint: number) {
        this.minPoint = minPoint;
        this.maxPoint = maxPoint;
    }

    isAroundOrInside(other: AxisLine) {
        return this.isFullyInside(other) || this.isAround(other);
    }
    
    isFullyInside(other: AxisLine) {
        return other.isAround(this);
    }

    isAround(other: AxisLine) {
        return this.startsBeforeOtherStarts(other) && this.endAfterOtherEnd(other);
    }

    crossOtherMin(other: AxisLine) {
        return this.startsBeforeOtherStarts(other) && this.endsInside(other);
    }

    crossOtherMax(other: AxisLine) {
        return other.crossOtherMin(this);
    }

    isCollision(other: AxisLine) {
        return this.isAroundOrInside(other) || this.crossOtherMin(other) || this.crossOtherMax(other);
    }
 
    //The lines don't cross
    endsBeforeOtherStarts(other: AxisLine) {
        return this.maxPoint <= other.minPoint;
    }

    //The lines don't cross
    startsAfterOtherEnded(other: AxisLine) {
        return other.endsBeforeOtherStarts(this);
    }

    startsBeforeOtherStarts(other: AxisLine) {
        return this.minPoint <= other.minPoint;
    }

    endAfterOtherEnd(other: AxisLine) {
        return this.maxPoint >= other.maxPoint;
    }

    endsInside(other: AxisLine) {
        return !this.endsBeforeOtherStarts(other) && !this.endAfterOtherEnd(other);
    }
}