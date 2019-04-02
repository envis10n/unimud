const tsnode = require("ts-node");

const path = require("path");

tsnode.register({ files: true });

require(path.resolve(__dirname, "worker.ts"));