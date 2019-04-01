import _connect from "./connect";
import _message from "./message";
import _json from "./json";

namespace Handlers {
    export const connect = _connect;
    export const message = _message;
    export const json = _json;
}

export = Handlers;
