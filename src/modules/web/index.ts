import { Worker } from "worker_threads";
import path from "path";

const worker = new Worker(path.resolve(__dirname, "import.js"));

export = worker;
