export interface User {
  email: string;
  password: string;
}

export interface Admin {
  _id: string;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  perfil: string;
  telefono: string;
  rol: string;
  dni: string;
}
