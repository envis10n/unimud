declare interface IObjectAny {
    [key: string]: any;
}

declare interface IEventObject extends IObjectAny {
    event: string;
    payload: IObjectAny;
}

declare type Option<T> = T | null;
