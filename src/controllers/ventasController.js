import { ventasModel } from "../models/ventasModel.js";

export const getVentas = async (req, res) => {
  const ventas = await ventasModel.getAll();
  res.status(200).json({
    message: "Request todas las ventas",
    data: ventas,
  });
  console.log(" Request todas las ventas ok");
};

export const createVentas = async (req, res) => {
  const { producto, monto } = req.body;
  await ventasModel.createVentas(producto, monto);
  res.status(201).json({
    message: "Venta registrada ok",
    data: { producto, monto },
  });
  console.log(" Venta guardada ok");
};

export const updateVentas = async (req, res) => {
  const { monto, id } = req.body;
  await ventasModel.updateVentas(monto, id);
  res.status(201).json({
    message: " Venta modificada ok",
  });
  console.log(" Venta modificada ok");
};

export const deleteVentas = async (req, res) => {
  const { id } = req.body;
  await ventasModel.deleteVentas(id);
  res.status(201).json({
    message: " Venta eliminada ok",
  });
  console.log(" Venta eliminada ok");
};
