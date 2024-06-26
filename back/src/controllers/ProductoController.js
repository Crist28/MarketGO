"use strict";

const Producto = require("../models/Producto");

const fs = require("fs");
const path = require("path");

const registro_producto_admin = async (req, res) => {
  if (req.user) {
    let data = req.body;

    let productos = await Producto.find({ titulo: data.titulo });

    if (productos.length == 0) {
      if (req.files && req.files.portada) {
        let img_path = req.files.portada.path;
        let name = img_path.split("\\");
        let portada_name = name[name.length - 1];

        data.slug = data.titulo
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "");
        data.portada = portada_name; // Utiliza el nombre de la imagen subida desde el frontend
      }

      let reg = await Producto.create(data);

      res.status(200).send({ data: reg });
    } else {
      res
        .status(200)
        .send({ data: undefined, message: "El título del producto ya existe" });
    }
  } else {
    res.status(500).send({ message: "NoAccess" });
  }
};

const listar_productos_admin = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).send({ message: "NoAccess" });
    }

    const { tipo, filtro } = req.params;

    let registro;

    if (!tipo || !filtro) {
      registro = await Producto.find();
    } else if (tipo === "titulo") {
      registro = await Producto.find({ titulo: new RegExp(filtro, "i") });
    } else if (tipo === "categoria") {
      registro = await Producto.find({ categoria: new RegExp(filtro, "i") });
    } else {
      return res.status(400).send({ message: "Tipo de filtro no válido" });
    }

    res.status(200).send({ data: registro });
  } catch (error) {
    console.error('Error al listar productos:', error);
    res.status(500).send({ message: "Error al listar productos", error });
  }
};

const obtener_portada = async (req, res) => {
  try {
    const img = req.params["img"];
    const imagePath = path.join(__dirname, "../uploads/productos", img);

    // Verificar si la imagen existe
    const exists = await fs.promises
      .access(imagePath)
      .then(() => true)
      .catch(() => false);

    if (exists) {
      // Si la imagen existe, enviarla como respuesta con el tipo de contenido adecuado
      res.sendFile(imagePath);
    } else {
      // Si la imagen no existe, enviar una imagen por defecto como respuesta
      const defaultImagePath = path.join(__dirname, "../uploads/default.jpg");
      res.sendFile(defaultImagePath);
    }
  } catch (error) {
    res.status(500).send("Error al obtener la imagen.");
  }
};

module.exports = {
  registro_producto_admin,
  listar_productos_admin,
  obtener_portada
};
