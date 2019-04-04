declare interface IObjectAny {
    [key: string]: any;
}

declare interface IEventObject extends IObjectAny {
    event: string;
    payload: IObjectAny;
}

declare type Option<T> = T | null;

declare interface IAccount {
    _key: string;
    uuid: string;
    username: string;
    hash: string;
    lastLogin: number;
    online: boolean;
    flags: string[];
    gmLevel: 0|1|2|3|4;
}
