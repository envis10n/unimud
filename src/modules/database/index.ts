import { fork } from "child_process";
import path from "path";
import { v4 } from "uuid";
import BorDB from "bordb";

const db = fork(path.join(__dirname, "db.import.js"));
const queries: Map<string, {
    resolve: (res: IObjectAny | IObjectAny[]) => void;
    reject: (err: Error) => void
}> = new Map();

function query(event: string, message: IObjectAny): Promise<IObjectAny|IObjectAny[]> {
    message.id = v4();
    message.event = event;
    return new Promise((resolve, reject) => {
        queries.set(message.id, {
            resolve: (res) => {
                resolve(res);
            },
            reject: (err) => {
                reject(err);
            },
        });
        db.send(message);
    });
}

db.on("message", (message) => {
    const qu = queries.get(message.id);
    if (qu !== undefined) {
        if (message.error) {
            qu.reject(new Error(message.error));
        } else {
            qu.resolve(message.result);
        }
        queries.delete(message.id);
    }
});

class BorCollection {
    constructor(public readonly name: string) {
        //
    }
    public async find(filter: IObjectAny, limit: number = 0): Promise<BorDB.IBorDoc[]> {
        const res = await query("find", {
            filter,
            limit,
        });
        return res as BorDB.IBorDoc[];
    }
    public async findOne(filter: IObjectAny): Promise<BorDB.IBorDoc> {
        const res = await query("findOne", {
            filter,
        });
        return res as BorDB.IBorDoc;
    }
    public async insert(document: BorDB.IBorDoc | BorDB.IBorDoc[]): Promise<void> {
        await query("insert", {
            document,
        });
    }
    public async update(filter: IObjectAny, update: IObjectAny): Promise<void> {
        await query("update", {
            filter,
            update,
        });
    }
    public async updateOne(handle: string | BorDB.IBorDoc, update: IObjectAny): Promise<void> {
        await query("updateOne", {
            handle,
            update,
        });
    }
}

namespace DB {
    export async function collection(name: string): Promise<BorCollection> {
        await query("collection", { name });
        return new BorCollection(name);
    }
}

export = DB;
