import { createClient } from "@libsql/client";
import dotenv from "dotenv/config";

const db = createClient({
  url: process.env.DB,
  authToken: process.env.TOKEN,
});

export default db;
