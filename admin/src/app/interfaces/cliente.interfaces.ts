export interface User {
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

export interface Cliente {
  [key: string]: string | undefined;
  nombres: string;
  apellidos: string;
  pais: string;
  email: string;
  password: string;
  perfil?: string;
  telefono?: string;
  genero?: string;
  f_nacimiento?: string;
  dni?: string;
}

// Define la interfaz RegUsuarioAdmin que coincide con lo que se necesita en admin dentro de RegistrarUsuarioAdmin
export interface RegUsuarioAdmin {
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

// Cliente ahora extiende RegUsuarioAdmin, ya que es un subconjunto de sus propiedades
export interface Cliente extends Partial<RegUsuarioAdmin> {
  pais: string;
  genero?: string;
  f_nacimiento?: string;
}

// RegistrarUsuarioAdmin ahora puede utilizar Cliente para admin
export interface RegistrarUsuarioAdmin {
  admin: Cliente;
  token: string;
}