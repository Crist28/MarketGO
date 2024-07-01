const Producto = require("../models/Producto");

const actualizar_producto_variedades_admin = async (req, res) => {
  if (req.user.role == "admin") {
    const id = req.params["id"];
    const data = req.body;
    try {
      let registro = await Producto.findByIdAndUpdate(
        id,
        {
            titulo_variedad: data.titulo_variedad,
            variedades: data.variedades

        }
      );
      res.status(200).send({ data: registro });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Error al actualizar el producto" });
    }
  } else {
    res.status(403).send({ message: "NoAccess" });
  }
};

module.exports = {
  actualizar_producto_variedades_admin,
};
