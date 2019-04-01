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

const wss = new WServer(port, host);

wss.on("listening", () => {
    console.log("[Net] WebSocket listening on port", port);
});

wss.on("connection", (client) => {
    console.log(`[Net] Client connected. <${client.uuid}>`);
    _handlers.connect(client);
});

wss.on("disconnect", (client) => {
    console.log(`[Net] Client disconnected. <${client.uuid}>`);
});

namespace Network {
    export const WSS = wss;
    export const Handlers = _handlers;
}

export = Network;
