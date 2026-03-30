import { getVentas, createVentas, updateVentas, deleteVentas } from "../controllers/ventasController.js";
import { Router } from "express";

const router = Router();

router.get("/ventas", getVentas);
router.post("/ventas", createVentas);
router.put("/ventas", updateVentas);
router.delete("/ventas", deleteVentas);

export default router;
