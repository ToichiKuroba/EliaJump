import { GameElementHandler } from "./elements/gameElementHandler";
import { Platform } from "./platform";
import { platformsConfig } from "./util/platformsConfig";
import { Stream } from "./util/stream";
import { parse, toSeconds } from "iso8601-duration";
import prand from 'pure-rand';

export class StreamPlatformField extends GameElementHandler {
    private static BaseSeed = 3948951295.589653;
    private static WidthUnitDevider = 12;
    private static WidthUnitPerHour = 1;
    private static SecondsPerHour = 3600;
    private static GapPerDay = 125;
    private static StreamHeight = 25;
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
            const date = new Date(element.liveStreamDate.getUTCFullYear(), element.liveStreamDate.getUTCMonth(), element.liveStreamDate.getUTCDate());
            const streamDate = date.getTime();
            if(streamDate < this._firstDay){ 
                this._firstDay = streamDate;
            }

            if(streamDate > this._lastDay) {
                this._lastDay = streamDate;
            }

            let streams = map.get(streamDate);
            if(streams === undefined)
            {
                streams = [];
                map.set(date.getTime(), streams);
            }

            streams.push(element);
        }

        return map;
    };

    private getDays() {
        const days: {date: Date, hasStreams: boolean}[] = []

        let previusDay = new Date(this._firstDay);
        days.push({date: previusDay, hasStreams: true});
        while(previusDay.getTime() < this._lastDay){
            let nextDay = new Date(previusDay.getTime());
            nextDay.setUTCDate(previusDay.getUTCDate() + 1);
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

    private get widthUnitWidth() {
        return this._width / StreamPlatformField.WidthUnitDevider;
    }

    subElementInitialize(): void {
        const days = this.getDays();
        const rowHeight = StreamPlatformField.GapPerDay + StreamPlatformField.StreamHeight;
        let currentY = this._baseLine;
        for (let index = 0; index < days.length; index++) {
            currentY -= rowHeight;
            const element = days[index];
            if(element.hasStreams) {
                const streams = this._streamsForDays.get(element.date.getTime());
                let remainingWidhtUnits = StreamPlatformField.WidthUnitDevider;
                let hasGap = false;
                let doubleDay : number = 0;
                for (let streamIndex = 0; streams && streamIndex < streams.length; streamIndex++) {
                    const stream = streams.sort(stream => stream.liveStreamDate.getTime())[streamIndex];              
                    let platform : Platform;    
                    [platform, remainingWidhtUnits, hasGap, doubleDay] =this.convertStreamIntoPlatforms(stream, currentY,remainingWidhtUnits, hasGap, doubleDay)
                    this.add(platform);
                }
                currentY -= rowHeight * doubleDay;
            }
        }
    }

    convertStreamIntoPlatforms(stream: Stream, y: number, remainingWidhtUnits: number, hasGap: boolean, doubleDay: number) : [platform: Platform, remainingWidthUnits: number, hasGap: boolean, doubleDay: number] {
        let widhtUnits = this.calculateFullStreamHours(stream) * StreamPlatformField.WidthUnitPerHour;

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
            showInUnit = this.getShowInWidthUnit(stream, startUnit, endUnit - 1 - widhtUnits);
            hasGap = showInUnit != startUnit;
        }

        const x = this.widthUnitWidth * showInUnit;

        remainingWidhtUnits -= showInUnit;
        remainingWidhtUnits -= widhtUnits;

        return [new Platform(x, y, width, StreamPlatformField.StreamHeight), remainingWidhtUnits, hasGap, doubleDay];
    }

    isMorningStream(stream: Stream) {
        return stream.liveStreamDate.getUTCHours() <= 11;
    }

    calculateFullStreamHours(stream: Stream) {
        return Math.floor(toSeconds(parse(stream.length)) / StreamPlatformField.SecondsPerHour);
    }

    getShowInWidthUnit(stream: Stream, startUnit: number, endUnit: number) {
        
        const rng = prand.xoroshiro128plus(stream.liveStreamDate.getTime() ^ StreamPlatformField.BaseSeed);
        const [randomShowInUnit] = prand.uniformIntDistribution(startUnit, endUnit, rng);
        return randomShowInUnit;
    }
}