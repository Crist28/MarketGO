//Login
export interface LoginData {
  email: string;
  password: string;
}
export interface LoginResponse {
  data: {
    admin: User;
    token: string;
  };
}
interface User {
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
