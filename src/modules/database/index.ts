import BorDB from "bordb";
import path from "path";

const db = new BorDB(path.join(process.cwd(), "db"));
export = db;
