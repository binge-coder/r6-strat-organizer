import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const sqlite = new Database("./data/db.sqlite");

const db = drizzle(sqlite);

export default db;
