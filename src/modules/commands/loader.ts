import vm from "vm";
import path from "path";
import fs from "fs";
import { promisify as _p } from "util";
import Commands from ".";

const readdir = _p(fs.readdir);
const stat = _p(fs.stat);

const bootstrap: vm.Script = new vm.Script(fs.readFileSync(path.resolve(process.cwd(),
    "src",
    "modules",
    "commands",
    "bootstrap.js")).toString());

function commandRoot(name: string): string {
    return path.resolve(process.cwd(),
        "src",
        "modules",
        "commands",
        "handlers",
        `${name}.ts`);
}

async function load(name: string): Promise<Commands.ICommand> {
    const filePath: string = commandRoot(name);
    const command: Commands.ICommand = bootstrap.runInNewContext({ require, process })(filePath);
    return command;
}

interface ICommandList {
    [key: string]: Commands.ICommand;
}

export default async function(): Promise<ICommandList> {
    const res: ICommandList = {};
    const root = path.resolve(process.cwd(),
    "src",
    "modules",
    "commands",
    "handlers");
    const dir = await readdir(root);
    for (const filePath of dir) {
        const file = path.resolve(root, filePath);
        const fstat = await stat(file);
        if (fstat.isFile()) {
            const finfo = path.parse(file);
            const command: Commands.ICommand = await load(finfo.name);
            res[finfo.name] = command;
        }
    }
    return res;
}
