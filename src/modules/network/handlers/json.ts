import { WClient } from "../ws";
import { cache as commands } from "@modules/commands";
import arguets from "arguets";

interface ICommandPayload {
    command: string;
    args: string[];
}

async function commandHandler(client: WClient, payload: ICommandPayload): Promise<void> {
    const command = commands.get(payload.command);
    if (command !== undefined) {
        const parsed = arguets(payload.args, command.options);
        await command.handler(client, parsed);
    } else {
        client.send(`Unknown command: ${payload.command}`);
    }
}

export default async function(client: WClient, dobj: IEventObject) {
    switch (dobj.event) {
        case "command":
            if (client.prompt !== null) {
                client.prompt(dobj.payload);
            } else {
                await commandHandler(client, dobj.payload as ICommandPayload);
            }
            break;
    }
}
