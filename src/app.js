import express from "express";
import router from "./routes/ventasRoutes.js";
import "dotenv/config";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

// Lantency - Proceso + DB. No RTT
app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1_000_000;

    console.log(`Backend process latency: ${req.method} ${req.originalUrl} → ${duration.toFixed(2)} ms`);
  });

  next();
});

app.get("/health", (req, res) => {
  res.status(200).type("text").send(`
Servidor saludable

╭─────────╮
│  ◉   ◉  │  Hi!, I'm fine!
│    ▿    │
│   ╰─╯   │
╰───┬─┬───╯
    │ │
`);
});

app.use("/", router);

const server = app.listen(PORT, () => {
  console.log("  Servidor iniciado ok en puerto: ", PORT);
});

const shutdown = (signal) => {
  console.log(`   Señal ${signal} recibida, cerrando servidor...`);
  server.close(() => {
    console.log("   Servidor cerrado correctamente");
    process.exit(0);
  });

  // Si algo queda colgado (conexión abierta, etc.), forzamos salida
  // a los 10s para no dejar el contenedor colgado indefinidamente
  setTimeout(() => {
    console.error("   Forzando cierre por timeout");
    process.exit(1);
  }, 10_000).unref();
};

process.on("   SIGTERM", () => shutdown("SIGTERM"));
process.on("   SIGINT", () => shutdown("SIGINT"));
