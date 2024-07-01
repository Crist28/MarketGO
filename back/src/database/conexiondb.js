'use strict';

const mongoose = require("mongoose");

const dbConnection = async () => {
  const dbUrl = process.env.MONGODB_URL || "mongodb+srv://Crist28:BlNJyvNVqg7O3nmt@atlascluster.5r2adke.mongodb.net/tiendadb?retryWrites=true&w=majority&appName=AtlasCluster";
  try {
    await mongoose.connect(dbUrl);
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
};

module.exports = {
  dbConnection,
};
