import WebSocket from "ws";
import { v4 } from "uuid";
import { EventEmitter as EE } from "ee-ts";

interface IWServerEvents {
    listening(port: number): void;
    connection(client: WServer.WClient): void;
    disconnect(client: WServer.WClient): void;
}

interface IWClientEvents {
    close(code: number, reason?: string): void;
    message(message: string): void;
    json(dobj: IObjectAny): void;
    error(err: Error): void;
}

class WServer extends EE<IWServerEvents> {
    private clients: Map<string, WServer.WClient> = new Map();
    private server: WebSocket.Server;
    constructor(port: number, host: string) {
        super();
        this.server = new WebSocket.Server({ port, host });
        this.server.on("listening", () => {
            this.emit("listening", port);
        });
        this.server.on("connection", (socket) => {
            const client = new WServer.WClient(socket);
            this.clients.set(client.uuid, client);
            socket.on("close", (code, reason) => {
                client.emit("close", code, reason);
                this.emit("disconnect", client);
                this.clients.delete(client.uuid);
            });
            socket.on("message", (message) => {
                try {
                    const dobj: IObjectAny = JSON.parse(message.toString());
                    client.emit("json", dobj);
                } catch (e) {
                    client.emit("message", message.toString());
                }
            });
            socket.on("error", (err) => {
                client.emit("error", err);
            });
            this.emit("connection", client);
        });
    }
}

namespace WServer {
    export class WClient extends EE<IWClientEvents> {
        public readonly uuid: string = v4();
        constructor(private socket: WebSocket) {
            super();
        }
        public send(message: string): void {
            this.socket.send(message);
        }
        public json(dobj: IObjectAny): void {
            this.send(JSON.stringify(dobj));
        }
    }
}

export = WServer;
