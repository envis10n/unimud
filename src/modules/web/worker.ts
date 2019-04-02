import Koa from "koa";
import serve from "koa-static";
import path from "path";

const app = new Koa();

app.use(serve(path.resolve(process.cwd(), "client")));

app.listen(13388, () => {
    console.log("[Web] Listening on 13388.");
});
