export abstract class TypedEvent<EventMap extends object, EventType extends keyof EventMap> extends Event 
{    
    constructor(type : EventType, eventInitDict?: EventInit){
        super(type as string, eventInitDict);
    }   
}