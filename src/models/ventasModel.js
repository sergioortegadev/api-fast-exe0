import db from "../config/db.js";

export const ventasModel = {
  getAll: async () => {
    const result = await db.execute("SELECT * FROM ventas");
    return result.rows;
  },
  createVentas: async (producto, monto) => {
    return await db.execute({
      sql: "INSERT INTO ventas (producto, monto) VALUES (?, ?)",
      args: [producto, monto],
    });
  },
  updateVentas: async (monto, id) => {
    return await db.execute({
      sql: "UPDATE ventas SET monto = ? WHERE id = ?",
      args: [monto, id],
    });
  },
  deleteVentas: async (id) => {
    return await db.execute({
      sql: "DELETE FROM ventas WHERE id = ?",
      args: [id],
    });
  },
};
