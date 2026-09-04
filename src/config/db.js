import { createClient } from "@libsql/client";
import "dotenv/config";

let db;
try {
  db = createClient({
    url: process.env.DB,
    authToken: process.env.TOKEN,
  });

  console.log("  - Conexión a DB exitosa -");
} catch (error) {
  console.error(`   ERROR al conectar la DB:\n${error}`);
}

export default db;
