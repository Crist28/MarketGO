'use strict';

const bcrypt = require('bcrypt');

const Admin = require('../models/Admin');
const Jwt = require('../tokens/Jwt');

const registro_admin = async(req, res) =>{
    try {
        const data = req.body;
        const adminExistente = await Admin.findOne({ email: data.email });
    
        if (adminExistente) {
            return res.status(409).send({ msg: 'El correo ya existe en la base de datos', data: undefined });
        }
        if (!data.password) {
            return res.status(400).send({ msg: 'No hay una contraseña', data: undefined });
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
    
        // Guardar el registro de cliente en la base de datos
        const nuevoAdmin = new Admin({
          nombres: data.nombres,
          apellidos: data.apellidos,
          email: data.email,
          password: hashedPassword,
          perfil: data.perfil,
          telefono: data.telefono,
          rol: data.rol,
          dni: data.dni,
        });
    
        await nuevoAdmin.save();
    
        res.status(201).send({ data: true });
      } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'Error en el servidor', data: undefined });
      }
}

const login_admin = async (req = request, res = response) => {

  try {
    const data = req.body;

    // Verificar si el correo electrónico existe en la base de datos
    const admin = await Admin.findOne({ email: data.email });
    if (!admin) {
      return res.status(404).send({ msg: 'El correo no está registrado', data: undefined });
    }

    // Verificar la coincidencia de contraseñas
    const passwordMatch = await bcrypt.compare(data.password, admin.password);
    if (!passwordMatch) {
      console.log({ msg: 'Contraseña incorrecta', data: undefined });
      return res.status(401).send({ msg: 'Contraseña incorrecta', data: undefined });
    }

    // Generar el token de acceso
    const token = Jwt.createToken(admin);

    res.status(200).send({ data: { admin, token } });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: 'Error en el servidor', data: undefined });
  }

};

module.exports = {
    registro_admin,
    login_admin
};