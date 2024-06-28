"use strict";

const Cupon = require("../models/Cupon");

const registro_cupon_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == "admin") {
      let data = req.body;
      let reg = await Cupon.create(data);

      res.status(200).send({ data: reg });
    } else {
      res.status(404).send({ message: "NoAccess" });
    }
  } else {
    res.status(500).send({ message: "NoAccess" });
  }
};

const listar_cupones_filtro_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === "admin") {
      let tipo = req.params["tipo"];
      let filtro = req.query["filtro"];

      if (!tipo) {
        let registro = await Cupon.find();
        res.status(200).send({ data: registro });
      } else {
        if (tipo === "codigo") {
          let registro = await Cupon.find({
            codigo: new RegExp(filtro, "i"),
          });
          res.status(200).send({ data: registro });
        }
      }
    }
  }
};

const obtener_cupon_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === "admin") {
      let id = req.params["id"];

      try {
        let registro = await Cupon.findById(id);
        res.status(200).send({ data: registro });
      } catch (error) {
        res.status(401).send({ data: undefined });
      }

    }else{
      res.status(500).send({ error: 'Error interno del servidor' });
    }
  }else{
    res.status(403).send({ error: 'Acceso denegado' });
  }
}

const actualizar_cupon_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === "admin") {
      let data = req.body;
      let id = req.params["id"];

      let registro = await Cupon.findByIdAndUpdate(id, data);

      res.status(200).send({ data: registro });
    }else{
      res.status(500).send({ error: 'Error interno del servidor' });
    }
  }else{
    res.status(403).send({ error: 'Acceso denegado' });
  }
}

const eliminar_cupon_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === "admin") {
      let id = req.params["id"];
      try {
        let registro = await Cupon.findByIdAndDelete(id);

        if (!registro) {
          return res.status(404).send({ error: 'Cupon no encontrado' });
        }

        res.status(200).send({ data: registro });
      } catch (error) {
        res.status(500).send({ error: 'Error interno del servidor' });
      }
    } else {
      res.status(403).send({ error: 'Acceso denegado' });
    }
  } else {
    res.status(403).send({ error: 'Acceso denegado' });
  }
}

module.exports = {
  registro_cupon_admin,
  listar_cupones_filtro_admin,
  obtener_cupon_admin,
  actualizar_cupon_admin,
  eliminar_cupon_admin
};
