import WServer from "./ws";
import _handlers from "./handlers";

let port: number;
let host: string;

if (process.env.WS_PORT !== undefined && !isNaN(Number(process.env.WS_PORT))) {
    port = Number(process.env.WS_PORT);
} else {
    port = 13387;
}

host = process.env.WS_HOST || "localhost";

function asEvent(obj: IObjectAny): IEventObject {
    if (typeof obj.event === "string"
        && typeof obj.payload === "object"
        && obj.payload !== null) {
        return obj as IEventObject;
    } else {
        throw new TypeError("Invalid event object.");
    }
}

const wss = new WServer(port, host);

wss.on("listening", () => {
    console.log("[Net] WebSocket listening on port", port);
});

wss.on("connection", (client) => {
    console.log(`[Net] Client connected. <${client.uuid}>`);
    _handlers.connect(client);
    client.on("message", (message) => {
        _handlers.message(client, message);
    });
    client.on("json", (dobj) => {
        try {
            _handlers.json(client, asEvent(dobj));
        } catch (e) {
            console.log(`[Events] Client send malformed event JSON.\n${JSON.stringify(dobj)}`);
        }
    });
});

wss.on("disconnect", (client) => {
    console.log(`[Net] Client disconnected. <${client.uuid}>`);
});

namespace Network {
    export const WSS = wss;
    export const Handlers = _handlers;
}

export = Network;
