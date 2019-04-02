import { IOptionDef, IArguments } from "arguets";
import { WClient } from "@modules/network/ws";
import loader from "./loader";

namespace Commands {
    export type CommandHandler = (client: WClient, args: IArguments) => Promise<void>;
    export interface ICommand {
        permissions: string[];
        options: IOptionDef[];
        handler: CommandHandler;
    }
    export const cache: Map<string, ICommand> = new Map();
    export async function reload() {
        const commands = await loader();
        for (const key of Object.keys(commands)) {
            cache.set(key, commands[key]);
        }
    }
}

export = Commands;
