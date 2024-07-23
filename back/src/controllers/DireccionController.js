"use strict";

const Direccion = require("../models/Direccion");

const registro_direccion_cliente = async (req, res) => {
  if (req.user) {
    let data = req.body;

    if(data.principal){
      let direcciones = await Direccion.find({cliente: data.cliente});

      direcciones.forEach(async element => {
        await Direccion.findByIdAndUpdate({_id: element._id}, {
          principal: false
        })
      });
    }

    let reg = await Direccion.create(data);

    res.status(200).send({ data: reg });
  } else {
    res.status(500).send({ message: "NoAccess" });
  }
};

const obtener_direccion_todos_cliente = async (req, res) => {
  if (req.user) {
    let id = req.params['id'];
    let direcciones = await Direccion.find({cliente: id}).populate('cliente').sort({createdAt: -1});
    res.status(200).send({ data: direcciones });
  } else {
    res.status(500).send({ message: "NoAccess" });
  }
};

const cambiar_direccion_principal_cliente = async (req, res) => {
  if (req.user) {
    let id = req.params['id'];
    let cliente = req.params['cliente'];

    let direcciones = await Direccion.find({cliente:cliente});

    direcciones.forEach(async element => {
      await Direccion.findByIdAndUpdate({_id: element._id}, {
        principal: false
      })
    });

    await Direccion.findByIdAndUpdate({_id:id},{principal:true})

    res.status(200).send({ data: true });
  } else {
    res.status(500).send({ message: "NoAccess" });
  }
};

module.exports = {
    registro_direccion_cliente,
    obtener_direccion_todos_cliente,
    cambiar_direccion_principal_cliente
};
