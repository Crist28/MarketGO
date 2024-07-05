"use strict";

const Config = require("../models/Config");

const path = require("path");
const fs = require("fs");

const obtener_config_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == "admin") {
      try {
        const registros = await Config.find(); // Obtener todos los registros

        if (!registros || registros.length === 0) {
          return res
            .status(404)
            .send({ message: "No se encontraron registros" });
        }

        res.status(200).send({ data: registros });
      } catch (error) {
        console.error("Error al obtener los registros:", error);
        res.status(500).send({ message: "Error en el servidor" });
      }
    } else {
      res.status(403).send({ message: "NoAccess" });
    }
  } else {
    res.status(403).send({ message: "NoAccess" });
  }
};

const actualizar_config_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == "admin") {
      const id = req.params.id; // Obtener el ID desde la URL

      let data = req.body;
      let registro; // Movemos la declaración de registro aquí

      if (req.files) {
        // SI HAY UNA NUEVA IMAGEN DE logo
        console.log("Si hay imagen");
        const img_path = req.files.logo.path;
        const name = img_path.split("\\");
        const logo_name = name[name.length - 1];

        let configAnterior = await Config.findById(id); // Usar el ID para buscar la configuración

        registro = await Config.findByIdAndUpdate(id, {
          categorias: JSON.parse(data.categorias),
          titulo: data.titulo,
          logo: logo_name,
          serie: data.serie,
          correlativo: data.correlativo,
        });

        // Eliminar la imagen anterior de la carpeta 'uploads/configuraciones' si existe
        if (configAnterior.logo) {
          const imagePath = path.join(
            __dirname,
            "../uploads/configuraciones",
            configAnterior.logo
          );
          fs.unlinkSync(imagePath);
        }
      } else {
        console.log("No hay imagen");
        registro = await Config.findByIdAndUpdate(id, {
          categorias: data.categorias,
          titulo: data.titulo,
          serie: data.serie,
          correlativo: data.correlativo,
        });
      }

      res.status(200).send({ data: registro });
    } else {
      res.status(403).send({ message: "NoAccess" });
    }
  } else {
    res.status(403).send({ message: "NoAccess" });
  }
};

const obtener_logo = async (req, res) => {
  try {
    const img = req.params["img"];
    const imagePath = path.join(__dirname, "../uploads/configuraciones", img);

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

const obtener_config_publico = async (req, res) => {
  let registro = await Config.findById({ _id: "668001eb288bc44a7f846ef6" });
  res.status(200).send({ data: registro });
};

module.exports = {
  actualizar_config_admin,
  obtener_config_admin,
  obtener_logo,
  obtener_config_publico,
};
