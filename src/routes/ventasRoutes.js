import {
  getVentas,
  getVentasPdf,
  getUnaVenta,
  createVentas,
  updateVentas,
  deleteVentas,
} from "../controllers/ventasController.js";
import { Router } from "express";

const router = Router();

router.get("/ventas", getVentas);
router.get("/ventas-informe", getVentasPdf);
router.get("/ventas/:id_venta", getUnaVenta);
router.post("/ventas", createVentas);
router.put("/ventas", updateVentas);
router.delete("/ventas/:id_venta", deleteVentas);

export default router;
