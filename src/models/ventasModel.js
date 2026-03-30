import pool from "../config/db.js";

export const ventasModel = {
  getAll: async () => {
    const [rows] = await pool.query("SELECT * FROM ventas");
    return rows;
  },
  createVentas: async (producto, monto) => {
    return await pool.query("INSERT INTO ventas (producto, monto) VALUES (?, ?)", [producto, monto]);
  },
  updateVentas: async (monto, id) => {
    return await pool.query("UPDATE ventas SET monto = ? WHERE id = ?", [monto, id]);
  },
  deleteVentas: async (id) => {
    return await pool.query("DELETE FROM ventas WHERE id = ?", [id]);
  },
};
