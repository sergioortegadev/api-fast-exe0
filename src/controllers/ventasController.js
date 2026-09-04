import { validarVenta } from "../middlewares/validarCampos.js";
import { ventasModel } from "../models/ventasModel.js";
import { check } from "express-validator";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getVentasPdf = async (req, res) => {
  try {
    // traemos data de la DB
    const ventas = await ventasModel.getAll();

    // 1. Resolver la ruta de la plantilla .hbs
    // Subimos un nivel ('..') para salir de 'controllers' e ingresamos a 'utils/template.hbs'
    const plantillaPath = path.join(__dirname, "..", "utils", "template.hbs");
    const plantillaHtml = fs.readFileSync(plantillaPath, "utf-8");

    // 2. Resolver y convertir el logo a Base64
    // Subimos un nivel ('..') para salir de 'controllers' e ingresamos a 'assets/logo.jpg'
    const logoPath = path.join(__dirname, "..", "assets", "logo1.jpg");
    const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });
    const logoSrc = `data:image/jpeg;base64,${logoBase64}`;

    // 3. Compilar el template con Handlebars
    const template = Handlebars.compile(plantillaHtml);

    // 4. Inyectar los datos de la DB y el logo al template
    const htmlFinal = template({
      subTitle: "Resumen Operativo de Facturación",
      logo: logoSrc,
      items: ventas,
    });

    // 5. Inicializar Puppeteer para renderizar el HTML a PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const pagina = await browser.newPage();

    // Asignamos el HTML compilado
    await pagina.setContent(htmlFinal, { waitUntil: "networkidle0" });

    // 6. Generar el buffer del PDF en formato A4
    const pdfBuffer = await pagina.pdf({
      format: "A4",
      printBackground: true, // Obligatorio para pintar los fondos #2b37fb y #3f3f3f
      margin: {
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
      },
    });

    await browser.close();

    // 7. Configurar cabeceras HTTP para enviar el archivo PDF al cliente
    res.setHeader("Content-Type", "application/pdf");
    // res.setHeader("Content-Disposition", "attachment; filename=reporte-mensual.pdf");
    res.setHeader("Content-Disposition", "inline; filename=reporte-mensual.pdf");

    // FIN: Enviamos el buffer directamente al cliente
    return res.send(pdfBuffer);
  } catch (error) {
    console.error("   >> Error al generar el PDF en el controlador:\n", error);
    return res.status(500).json({ message: "Error interno al generar el reporte" });
  }
};

export const getVentas = async (req, res) => {
  const venta = await ventasModel.getAll();

  console.table(venta);

  return res.status(200).json({
    message: "Request de la venta",
    data: venta,
  });
};

export const getUnaVenta = async (req, res) => {
  const id = req.params.id_venta;
  const venta = await ventasModel.getOne(id);

  if (venta.length === 0) {
    console.log(" Request una venta Error, venta no encontrada.");
    return res.status(404).json({
      message: "Venta no encontrada",
    });
  }
  console.log(" Request una sola ventas ok");
  console.table(venta);
  return res.status(200).json({
    message: "Request de la venta",
    data: venta,
  });
};

// check con express validator
export const createVentas = [
  check("producto", "El producto es obligatorio").notEmpty(),
  check("monto", "El monto es obligatorio").notEmpty(),
  validarVenta,
  async (req, res) => {
    const { producto, monto } = req.body;
    await ventasModel.createVentas(producto, monto);
    res.status(201).json({
      message: "Venta registrada ok",
      data: { producto, monto },
    });
    console.log(" Venta guardada ok");
  },
];

// check con ex valid
export const updateVentas = [
  check("monto")
    .notEmpty()
    .withMessage("El monto es obligatorio.")
    .isLength({ max: 120 })
    .withMessage("El monto no debe superar los 120 caracteres."),
  validarVenta,
  async (req, res) => {
    const { monto, id } = req.body;
    await ventasModel.updateVentas(monto, id);
    res.status(201).json({
      message: " Venta modificada ok",
    });
    console.log(" Venta modificada ok");
  },
];

export const deleteVentas = async (req, res) => {
  const id = req.params.id_venta;
  const venta = await ventasModel.getOne(id);

  if (venta.length === 0) {
    console.log(" Delete una venta Error, venta no encontrada.");
    return res.status(404).json({
      message: "Venta no encontrada",
    });
  }

  await ventasModel.deleteVentas(id);
  res.status(201).json({
    message: " Venta eliminada ok",
  });
  console.log(" Venta eliminada ok");
};
