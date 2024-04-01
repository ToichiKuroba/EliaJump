import { Day } from "../day";
import { GameElementHandler } from "../elements/gameElementHandler";
import { EliaBreakPlatform } from "./eliaBreakPlatform";
import { Figure } from "../figure";
import { Platform } from "./platform";
import { SavePoint } from "../savePoint";
import { SavePointProvider, SavePointsProvidedListener } from "../savePointProvider";
import { StreamPlatform } from "./streamPlatform";
import { platformsConfig } from "../util/platformsConfig";
import { Stream } from "../util/stream";
import { parse, toSeconds } from "iso8601-duration";
import prand from 'pure-rand';
import { SavePointPlatform } from "./savePointPlatform";

export class StreamPlatformField extends GameElementHandler implements SavePointProvider {
    private static BaseSeed = 3948951295.589653;
    private static WidthUnitDevider = 12;
    private static WidthUnitPerHour = 1;
    private static SecondsPerHour = 3600;
    private static GapPerDay = 150;
    private static StreamHeight = 75;
    private readonly _streamsForDays : Map<number, Stream[]>;
    private _firstDay : number = Date.now();
    private _lastDay : number = 0;
    private readonly _width: number;
    private readonly _dayElementContainer: HTMLElement;
    private readonly _baseLine: number;
    private readonly _x: number;
    private getStreamsForDays() : Map<number, Stream[]>  {
        const map: Map<number, Stream[]> = new Map();
        for (let index = 0; index < platformsConfig.liveStreams.length; index++) {
            const element = platformsConfig.liveStreams[index];
            const date = new Date(element.liveStreamDate.getFullYear(), element.liveStreamDate.getMonth(), element.liveStreamDate.getDate());
            const streamDate = date.getTime();
            if(streamDate < this._firstDay){ 
                this._firstDay = streamDate;
            }

            if(streamDate > this._lastDay) {
                this._lastDay = streamDate;
            }

            let streams = map.get(streamDate);

            if((streams == undefined || !streams.some(stream => stream.liveStreamDate.getTime() == element.liveStreamDate.getTime())) && this.calculateFullStreamHours(element) > 0){  
                if(streams === undefined)
                {
                    streams = [];
                    map.set(date.getTime(), streams);
                }

                streams.push(element);
            }
        }

        return map;
    };

    private getDays() {
        const days: {date: Date, hasStreams: boolean}[] = []

        let previusDay = new Date(this._firstDay);
        days.push({date: previusDay, hasStreams: true});
        while(previusDay.getTime() < this._lastDay){
            let nextDay = new Date(previusDay.getTime());
            nextDay.setDate(previusDay.getDate() + 1);
            days.push({date: nextDay, hasStreams: this._streamsForDays.has(nextDay.getTime())});
            previusDay = nextDay;
        }

        return days;
    }

    constructor(x: number, baseLine: number, width: number, dayElementContainer: HTMLElement) {
        super();
        this._x = x;
        this._baseLine = baseLine;
        this._width = width;
        this._dayElementContainer = dayElementContainer;
        this._streamsForDays = this.getStreamsForDays();
    }

    savePointsProvidedListeners:SavePointsProvidedListener[] = [];
    set onSavePointsProvided(listener: SavePointsProvidedListener) {
        if(this._savePoints.length) {
            listener(this._savePoints);
        }

        this.savePointsProvidedListeners.push(listener);
    }

    private savePointsProvided() {
        for (let index = 0; index < this.savePointsProvidedListeners.length; index++) {
            const listener = this.savePointsProvidedListeners[index];
            listener(this._savePoints);
        }
    }

    private _savePoints:SavePoint[] = [];

    private get widthUnitWidth() {
        return this._width / StreamPlatformField.WidthUnitDevider;
    }

    subElementInitialize(): void {
        const days = this.getDays();
        const rowHeight = StreamPlatformField.GapPerDay + StreamPlatformField.StreamHeight;
        let currentY = this._baseLine;
        this._dayElementContainer.style.setProperty('--dayHeight', rowHeight + "px");
        this._dayElementContainer.style.setProperty('--platformHeight', StreamPlatformField.StreamHeight + "px");
        let lastSavePointDate= days[0].date;
        for (let index = 0; index < days.length; index++) {
            currentY -= rowHeight;
            const day = days[index];
            let doubleDay : number = 0;
            if(day.hasStreams) {
                const streams = this._streamsForDays.get(day.date.getTime());
                let remainingWidhtUnits = StreamPlatformField.WidthUnitDevider;
                let hasGap = false;
                for (let streamIndex = 0; streams && streamIndex < streams.length; streamIndex++) {
                    const stream = streams.sort((streamA, streamB) => streamA.liveStreamDate.getTime() - streamB.liveStreamDate.getTime())[streamIndex];              
                    let platform : Platform;    
                    [platform, remainingWidhtUnits, hasGap, doubleDay] =this.convertStreamIntoPlatforms(stream, currentY,remainingWidhtUnits, hasGap, doubleDay);

                    
                    if(day.date.getMonth() != lastSavePointDate.getMonth()) {
                        let savePointPlatform = new SavePointPlatform(platform);
                        this.add(savePointPlatform);
                        this._savePoints.push(new SavePoint(stream.videoLink, lastSavePointDate.toLocaleDateString(undefined, {month: "long", year: "numeric"}), savePointPlatform));
                        lastSavePointDate = day.date;
                    }else {
                        this.add(platform);
                    }
                }
                currentY -= rowHeight * doubleDay;

                const daysUntilNextStream = this.getDaysUntilNextStream(days, index);
                if(daysUntilNextStream > (Figure.FullJumpHeight * 1.75) / rowHeight) {
                    const startY = currentY - StreamPlatformField.StreamHeight;
                    const endY = startY - rowHeight * (daysUntilNextStream - 1);
                    const showInUnit = this.getShowInWidthUnit(day.date.getTime(), 0, StreamPlatformField.WidthUnitDevider -2)
                    const x = this._x + this.widthUnitWidth * showInUnit;
                    this.add(new EliaBreakPlatform(x, startY, endY, this.widthUnitWidth * 2,  StreamPlatformField.StreamHeight));
                }
            }

            this.add(new Day(this._dayElementContainer, day.date, rowHeight + rowHeight * doubleDay));
        }

        this.topY = currentY;
        const end = document.createElement("span");
        end.style.setProperty("--dayHeight", "2000px");
        this._dayElementContainer.appendChild(end);
        this.savePointsProvided();
    }

    getDaysUntilNextStream(days: {date: Date, hasStreams: boolean}[], startIndex: number) {
        for (let index = startIndex + 1; index < days.length; index++) {
            if(days[index].hasStreams){
                return index - startIndex;
            }
        } 

        return -1;
    }

    convertStreamIntoPlatforms(stream: Stream, y: number, remainingWidhtUnits: number, hasGap: boolean, doubleDay: number) : [platform: Platform, remainingWidthUnits: number, hasGap: boolean, doubleDay: number] {
        let widhtUnits = this.calculateFullStreamHours(stream) * StreamPlatformField.WidthUnitPerHour;

        if(widhtUnits <= 1) {
            widhtUnits = 2;
        }

        if(widhtUnits >= 12) {
            widhtUnits = 11;
        }

        if(remainingWidhtUnits < widhtUnits || (!hasGap && remainingWidhtUnits == widhtUnits)) {
            y -= StreamPlatformField.GapPerDay + StreamPlatformField.StreamHeight;
            doubleDay++;
        }

        const width = this.widthUnitWidth * widhtUnits;
        const centerUnit = Math.floor(StreamPlatformField.WidthUnitDevider / 2);
        const startUnit = this.isMorningStream(stream) ? 0 : centerUnit;
        let showInUnit = startUnit;
        hasGap = false;
        if(widhtUnits < centerUnit) {
            const endUnit = centerUnit + startUnit;
            showInUnit = this.getShowInWidthUnit(stream.liveStreamDate.getTime(), startUnit, endUnit - widhtUnits);
            hasGap = showInUnit != startUnit;
        }

        const x = this._x + this.widthUnitWidth * showInUnit;

        remainingWidhtUnits -= showInUnit;
        remainingWidhtUnits -= widhtUnits;

        return [new StreamPlatform(stream, x, y, width, StreamPlatformField.StreamHeight), remainingWidhtUnits, hasGap, doubleDay];
    }

    isMorningStream(stream: Stream) {
        return stream.liveStreamDate.getUTCHours() <= 11;
    }

    calculateFullStreamHours(stream: Stream) {
        return Math.round(toSeconds(parse(stream.length)) / StreamPlatformField.SecondsPerHour);
    }

    getShowInWidthUnit(seed: number, startUnit: number, endUnit: number) {
        const rng = prand.xoroshiro128plus(seed ^ StreamPlatformField.BaseSeed);
        const [randomShowInUnit] = prand.uniformIntDistribution(startUnit, endUnit, rng);
        return randomShowInUnit;
    }
}