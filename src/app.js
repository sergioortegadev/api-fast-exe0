import express from "express";
import router from "./routes/ventasRoutes.js";
import "dotenv/config";

const PORT = process.env.PORT || 3005;

const app = express();

app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
  console.log("  Servidor iniciado ok en puerto: ", PORT);
});
