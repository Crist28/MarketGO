"use strict";

const Cliente = require("../models/Cliente");
const Jwt = require("../tokens/Jwt");

const bcrypt = require("bcrypt");

const registro_cliente = async (req, res) => {
  try {
    const data = req.body;
    const clienteExistente = await Cliente.findOne({ email: data.email });
    if (clienteExistente) {
      return res.status(409).send({
        msg: "El correo ya existe en la base de datos",
        data: undefined,
      });
    }
    if (!data.password) {
      return res
        .status(400)
        .send({ msg: "No hay una contraseña", data: undefined });
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const nuevoCliente = new Cliente({
      nombres: data.nombres,
      apellidos: data.apellidos,
      pais: data.pais,
      email: data.email,
      password: hashedPassword,
      perfil: data.perfil,
      telefono: data.telefono,
      genero: data.genero,
      f_nacimiento: data.f_nacimiento,
      dni: data.dni,
    });
    await nuevoCliente.save();
    res.status(201).send({ data: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error en el servidor", data: undefined });
  }
};

const login_cliente = async (req, res) => {
  try {
    const data = req.body;

    // Verificar si el correo electrónico existe en la base de datos
    const cliente = await Cliente.findOne({ email: data.email });
    if (!cliente) {
      return res
        .status(404)
        .send({ msg: "El correo no está registrado", data: undefined });
    }

    // Verificar la coincidencia de contraseñas
    const passwordMatch = await bcrypt.compare(data.password, cliente.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .send({ msg: "Contraseña incorrecta", data: undefined });
    }

    // Resto del código para el proceso de inicio de sesión
    // ...
    // Generar el token de acceso
    const token = Jwt.createToken(cliente);

    res.status(200).send({ data: { cliente, token } });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error en el servidor", data: undefined });
  }
};

const listar_cliente_filtro_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === "admin") {
      let tipo = req.params["tipo"];
      let filtro = req.params["filtro"];

      if (!tipo || !filtro) {
        let registro = await Cliente.find();
        res.status(200).send({ data: registro });
      } else {
        if (tipo === "nombres") {
          let registro = await Cliente.find({
            nombres: new RegExp(filtro, "i"),
          });
          res.status(200).send({ data: registro });
        } else if (tipo === "email") {
          let registro = await Cliente.find({ email: new RegExp(filtro, "i") });
          res.status(200).send({ data: registro });
        }
      }
    }else{
      return res.status(403).send({msg: "No tienes los permisos necesarios"})
    }
  }else{
    return res.status(403).send({msg: "No tienes los permisos necesarios"})
  }
};

const registro_cliente_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === "admin") {
      let data = req.body;

      const hashedPassword = await bcrypt.hash(data.password, 10);

      data.password = hashedPassword;

      let registro = await Cliente.create(data);
      res.status(200).send({ data: registro });
    }else{
      console.error('Error al registrar cliente:', error);
      res.status(500).send({ error: 'Error interno del servidor' });
    }
  }else{
    res.status(403).send({ error: 'Acceso denegado' });
  }
}

const obtener_cliente_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === "admin") {
      let id = req.params["id"];

      try {
        let registro = await Cliente.findById(id);
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

const actualizar_cliente_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === "admin") {
      let id = req.params["id"];
      let data = req.body;

      try {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        let registro = await Cliente.findByIdAndUpdate(id, {
          nombres: data.nombres,
          apellidos: data.apellidos,
          pais: data.pais,
          email: data.email,
          password: hashedPassword,
          perfil: data.perfil,
          telefono: data.telefono,
          genero: data.genero,
          f_nacimiento: data.f_nacimiento,
          dni: data.dni,
        }, { new: true });

        res.status(200).send({ data: registro });
      } catch (error) {
        res.status(401).send({ data: undefined });
      }

    } else {
      res.status(500).send({ error: 'Error interno del servidor' });
    }
  } else {
    res.status(403).send({ error: 'Acceso denegado' });
  }
};

const eliminar_cliente_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === "admin") {
      let id = req.params["id"];
      try {
        let registro = await Cliente.findByIdAndDelete(id);

        if (!registro) {
          return res.status(404).send({ error: 'Cliente no encontrado' });
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
  registro_cliente,
  login_cliente,
  listar_cliente_filtro_admin,
  registro_cliente_admin,
  obtener_cliente_admin,
  actualizar_cliente_admin,
  eliminar_cliente_admin
};
