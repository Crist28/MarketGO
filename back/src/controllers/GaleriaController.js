"use strict";

const Producto = require("../models/Producto");
const path = require("path");
const fs = require("fs");

const agregar_imagen_galeria_admin = async (req, res) => {
  if (req.user) {
    let id = req.params["id"];
    let data = req.body;

    let img_path = req.files.imagen.path;
    let name = img_path.split("\\");
    let imagen_name = name[name.length - 1]; // Obtener el nombre de archivo de la ruta completa

    let reg = await Producto.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          galeria: {
            imagen: imagen_name, // Usar el nombre de archivo generado automáticamente
            _id: data._id,
          },
        },
      }
    );

    res.status(200).send({ data: reg });
  } else {
    res.status(500).send({ message: "NoAccess" });
  }
};

const obtener_galeria = async (req, res) => {
  try {
    const img = req.params["img"];
    const imagePath = path.join(__dirname, "../uploads/galeria", img);

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

const eliminar_imagen_galeria_admin = async (req, res) => {
  if (req.user) {
    let id = req.params["id"];
    let data = req.body;

    try {
      // Obtener el producto para encontrar la imagen a eliminar
      let producto = await Producto.findById(id);
      if (!producto) {
        return res.status(404).send({ message: "Producto no encontrado" });
      }

      // Encontrar la imagen en la galería
      let imagenGaleria = producto.galeria.find(
        (img) => img._id.toString() === data._id
      );
      if (!imagenGaleria) {
        return res
          .status(404)
          .send({ message: "Imagen no encontrada en la galería" });
      }

      // Eliminar la imagen de la galería
      producto.galeria = producto.galeria.filter(
        (img) => img._id.toString() !== data._id
      );
      await producto.save();

      // Eliminar la imagen del sistema de archivos
      const imagePath = path.join(
        __dirname,
        "../uploads/galeria",
        imagenGaleria.imagen
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(
            "Error al eliminar la imagen del sistema de archivos:",
            err
          );
        } else {
          console.log("Imagen eliminada del sistema de archivos:", imagePath);
        }
      });

      res.status(200).send({ data: producto });
    } catch (error) {
      console.error("Error al eliminar la imagen de la galería:", error);
      res
        .status(500)
        .send({ message: "Error al eliminar la imagen de la galería" });
    }
  } else {
    res.status(500).send({ message: "NoAccess" });
  }
};

module.exports = {
  agregar_imagen_galeria_admin,
  obtener_galeria,
  eliminar_imagen_galeria_admin,
};
