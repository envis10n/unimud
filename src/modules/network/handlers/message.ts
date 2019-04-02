import { WClient } from "../ws";
import { cache as commands } from "@modules/commands";
import arguets from "arguets";

export default async function(client: WClient, message: string) {
    // Testing command handling.
    const cmd = message.trim().split(" ")[0];
    const args = message.trim().split(" ").slice(1);
    const command = commands.get(cmd);
    if (command !== undefined) {
        const parsed = arguets(args, command.options);
        await command.handler(client, parsed);
    } else {
        client.send(`Unknown command: ${cmd}`);
    }
}
