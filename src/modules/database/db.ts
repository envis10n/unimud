import BorDB from "bordb";
import path from "path";

console.log("[Database] Starting process...");

function postMessage(message: any) {
    if (process.send !== undefined) {
        process.send(message);
    }
}

try {

    function reply(uuid: string, message?: any, error?: Error) {
            const res: { id: string; result: any; error?: string } = {
                id: uuid,
                result: message,
            };
            if (error !== undefined) {
                res.error = error.message;
            }
            postMessage(res);
    }
    const db = new BorDB(path.join(process.cwd(), "db"));

    function find(collection: string, filter: IObjectAny, limit: number = 0): BorDB.IBorDoc[] {
        const col = db.collection(collection);
        return col.find(filter, limit);
    }

    function findOne(collection: string, filter: IObjectAny): Option<BorDB.IBorDoc> {
        const col = db.collection(collection);
        return col.findOne(filter) as Option<BorDB.IBorDoc>;
    }

    function update(collection: string, filter: IObjectAny, upd: IObjectAny) {
        const col = db.collection(collection);
        col.update(filter, upd);
    }

    function updateOne(collection: string, handle: string | BorDB.IBorDoc, upd: IObjectAny) {
        const col = db.collection(collection);
        col.updateOne(handle, upd);
    }

    function insert(collection: string, document: BorDB.IBorDoc | BorDB.IBorDoc[]) {
        const col = db.collection(collection);
        col.insert(document);
    }

    process.on("message", (message: any) => {
        console.log("[Database][Query]", message);
        try {
            switch (message.event) {
                case "collection":
                    db.collection(message.name);
                    reply(message.id, true);
                    break;
                case "find":
                    reply(message.id, find(message.collection, message.filter, message.limit));
                    break;
                case "findOne":
                    reply(message.id, findOne(message.collection, message.filter));
                    break;
                case "update":
                    update(message.collection, message.filter, message.update);
                    reply(message.id, true);
                    break;
                case "updateOne":
                    updateOne(message.collection, message.handle, message.update);
                    reply(message.id, true);
                    break;
                case "insert":
                    insert(message.collection, message.document);
                    reply(message.id, true);
                    break;
            }
        } catch (e) {
            reply(message.id, undefined, e);
        }
    });
    console.log("[Database] Running...");
} catch (e) {
    console.log("[Database][Error]", e);
}
