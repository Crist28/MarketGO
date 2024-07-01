"use strict";

const Producto = require("../models/Producto");
const Inventario = require("../models/Inventario");

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

      let inventario = await Inventario.create({
        admin: req.user.sub,
        cantidad: data.stock,
        proveedor: 'Primer registro',
        producto: reg._id,
      });

      res.status(200).send({ data: reg, inventario: inventario });
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
    console.error("Error al listar productos:", error);
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

const obtener_producto_admin = async (req = request, res = response) => {
  if (req.user) {
    if (req.user.role == "admin") {
      let id = req.params["id"];

      try {
        let registro = await Producto.findById({ _id: id });
        res.status(200).send({ data: registro });
      } catch (error) {
        res.status(200).send({ data: undefined });
      }
    } else {
      res.status(404).send({ message: "NoAccess" });
    }
  } else {
    res.status(500).send({ message: "NoAccess" });
  }
};

const actualizar_producto_admin = async (req = request, res = response) => {
  if (req.user.role == "admin") {
    const id = req.params["id"];
    const data = req.body;
    console.log("Entrando a actualizar_producto_admin");
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    try {
      let productoActualizado;
      const productoAnterior = await Producto.findById(id);

      if (req.files && req.files.portada) {
        // SI HAY UNA NUEVA IMAGEN DE PORTADA
        const img_path = req.files.portada.path;
        const name = img_path.split("\\");
        const portada_name = name[name.length - 1];

        // Eliminar la imagen anterior de la carpeta 'uploads/productos' si existe
        if (productoAnterior.portada) {
          const imagePath = path.join(
            __dirname,
            "../uploads/productos",
            productoAnterior.portada
          );
          fs.unlinkSync(imagePath);
        }

        // Actualizar los campos del producto con los datos enviados desde el frontend
        productoActualizado = await Producto.findByIdAndUpdate(id, {
          titulo: data.titulo,
          stock: data.stock,
          precio: data.precio,
          categoria: data.categoria,
          descripcion: data.descripcion,
          contenido: data.contenido,
          portada: portada_name,
        });
      } else {
        // NO HAY UNA NUEVA IMAGEN DE PORTADA, ACTUALIZAR LOS DEMÁS CAMPOS DEL PRODUCTO
        productoActualizado = await Producto.findByIdAndUpdate(
          id,
          {
            titulo: data.titulo,
            stock: data.stock,
            precio: data.precio,
            sku: data.sku,
            categoria: data.categoria,
            descripcion: data.descripcion,
            contenido: data.contenido,
          },
          { new: true }
        ); // Añadimos { new: true } para que nos devuelva el producto actualizado.
      }

      res.status(200).send({ data: productoActualizado });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Error al actualizar el producto" });
    }
  } else {
    res.status(403).send({ message: "NoAccess" });
  }
};

const eliminar_producto_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == "admin") {
      const id = req.params["id"];

      try {
        // Buscar el producto por su ID para obtener el nombre de la imagen
        const producto = await Producto.findById(id);

        // Si se encontró el producto
        if (producto) {
          // Obtener el nombre de la imagen asociada al producto
          const imagenProducto = producto.portada;

          // Eliminar el producto de la base de datos
          await Producto.findByIdAndDelete(id);

          // Eliminar la imagen asociada al producto
          const imagePath = path.join(
            __dirname,
            "../uploads/productos",
            imagenProducto
          );
          fs.unlinkSync(imagePath);
          console.log("Imagen del producto eliminada correctamente");

          res.status(200).send({ message: "Producto eliminado correctamente" });
        } else {
          res.status(404).send({ message: "Producto no encontrado" });
        }
      } catch (error) {
        res
          .status(500)
          .send({ message: "Error al eliminar el producto", error });
      }
    } else {
      res.status(403).send({ message: "NoAccess" });
    }
  } else {
    res.status(500).send({ message: "NoAccess" });
  }
};

//Metodos publicos

module.exports = {
  registro_producto_admin,
  listar_productos_admin,
  obtener_portada,
  obtener_producto_admin,
  actualizar_producto_admin,
  eliminar_producto_admin
};
