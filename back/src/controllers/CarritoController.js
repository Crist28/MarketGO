"use strict";

const Carrito = require("../models/Carrito");

const agregar_carrito_cliente = async (req, res) => {
  if (req.user) {
    let data = req.body;

    let carrito_cliente = await Carrito.find({cliente: data.cliente, producto: data.producto});

    if(carrito_cliente.length == 0){
      let registro = await Carrito.create(data);
      res.status(200).send({data: registro});
    }else if (carrito_cliente.length >= 1){
      res.status(200).send({data: undefined});
    }
  } else {
    return res.status(403).send({ msg: "No tienes los permisos necesarios" });
  }
};

const obtener_carrito_cliente = async (req, res) => {
  if (req.user) {
    let id = req.params['id'];

    let carrito_cliente = await Carrito.find({cliente: id}).populate('producto');
    res.status(200).send({data: carrito_cliente});
  } else {
    return res.status(403).send({ msg: "No tienes los permisos necesarios" });
  }
};

const eliminar_carrito_cliente = async (req, res) => {
  if (req.user) {
    let id = req.params['id'];

    let reg = await Carrito.findByIdAndDelete(id);
    res.status(200).send({data: reg});
  } else {
    return res.status(403).send({ msg: "No tienes los permisos necesarios" });
  }
}

module.exports = {
    agregar_carrito_cliente,
    obtener_carrito_cliente,
    eliminar_carrito_cliente
};
