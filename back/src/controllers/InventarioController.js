"use strict";

const Inventario = require("../models/Inventario");
const Producto = require("../models/Producto");

const listar_inventario_producto_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == "admin") {
      let id = req.params["id"];
      let reg = await Inventario.find({ producto: id }).populate("admin");

      res.status(200).send({ data: reg });
    } else {
      res.status(404).send({ message: "NoAccess" });
    }
  } else {
    res.status(500).send({ message: "NoAccess" });
  }
};

const eliminar_inventario_producto_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == "admin") {
      //obtener id del inventario
      let id = req.params["id"];
      //eliminando el inventario
      let reg = await Inventario.findByIdAndDelete({ _id: id });
      //obtener el registro de producto
      let prod = await Producto.findById({ _id: reg.producto });
      //calcular nuevo stock
      let nuevo_stock = parseInt(prod.stock) - parseInt(reg.cantidad);
      //actualizacion del nuevo stock al producto
      let producto = await Producto.findByIdAndUpdate(
        { _id: reg.producto },
        {
          stock: nuevo_stock,
        }
      );

      res.status(200).send({ data: producto });
    } else {
      res.status(404).send({ message: "NoAccess" });
    }
  } else {
    res.status(500).send({ message: "NoAccess" });
  }
};

const registro_inventario_producto_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == "admin") {
      let data = req.body;
      let reg = await Inventario.create(data);

      //obtener el registro de producto
      let prod = await Producto.findById({ _id: reg.producto });

      //calcular nuevo stock
      let nuevo_stock = parseInt(prod.stock) + parseInt(reg.cantidad);

      //actualizacion del nuevo stock al producto
      let producto = await Producto.findByIdAndUpdate(
        { _id: reg.producto },
        {
          stock: nuevo_stock,
        }
      );

      res.status(200).send({ data: reg });
    } else {
      res.status(404).send({ message: "NoAccess" });
    }
  } else {
    res.status(500).send({ message: "NoAccess" });
  }
};

module.exports = {
  listar_inventario_producto_admin,
  eliminar_inventario_producto_admin,
  registro_inventario_producto_admin,
};
