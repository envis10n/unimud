import WServer from "./ws";

let port: number;
let host: string;

if (process.env.WS_PORT !== undefined && !isNaN(Number(process.env.WS_PORT))) {
    port = Number(process.env.WS_PORT);
} else {
    port = 13387;
}

host = process.env.WS_HOST || "localhost";

export const wss = new WServer(port, host);
