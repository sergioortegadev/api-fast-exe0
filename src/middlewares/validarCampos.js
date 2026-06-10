import { validationResult } from "express-validator";

export const validarVenta = (req, res, next) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    console.log(`   > Error en validacion`);
    console.table(errores.mapped());

    return res.status(400).json({
      estado: false,
      mensaje: errores.mapped(),
    });
  }

  next();
};
