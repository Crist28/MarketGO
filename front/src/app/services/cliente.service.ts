import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Global } from '../environment/global.component';

declare let iziToast: any;

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  public url;

  constructor(private http: HttpClient) {
    this.url = Global.url;
  }

  login_cliente(data: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post(this.url + 'login_cliente', data, {headers: headers});
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    } else {
      return null;
    }
  }

  obtener_cliente_guest(id: string, token: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.get(`${this.url}obtener_cliente_guest/${id}`, { headers: headers });
  }

  actualizar_perfil_cliente_guest(id: any, data: any, token: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.put(this.url + 'actualizar_perfil_cliente_guest/' + id, data, {headers: headers});
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
  
    if (!token) {
      if (typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
      return false;
    }
  
    try {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
  
      if (!decodedToken || helper.isTokenExpired(token)) {
        if (typeof localStorage !== 'undefined') {
          localStorage.clear();
        }
        return false;
      }

    } catch (error) {
      localStorage.clear();
      if (typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
      return false;
    }
  
    return true;
  }

  obtener_config_publico(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.url}obtener_config_publico`, { headers });
  }

  agregar_carrito_cliente(data: any, token: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.post(`${this.url}agregar_carrito_cliente`,data, { headers: headers });
  }

  obtener_carrito_cliente(id: any, token: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.get(`${this.url}obtener_carrito_cliente/${id}`, { headers: headers });
  }

  eliminar_carrito_cliente(id: any, token: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.delete(`${this.url}eliminar_carrito_cliente/${id}`, { headers: headers });
  }

  registro_direccion_cliente(data: any, token: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.post(`${this.url}registro_direccion_cliente`,data, { headers: headers });
  }

  obtener_direccion_todos_cliente(id: any, token: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.get(`${this.url}obtener_direccion_todos_cliente/${id}`, { headers: headers });
  }

  cambiar_direccion_principal_cliente(id: any, cliente: any, token: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.put(`${this.url}cambiar_direccion_principal_cliente/${id}/${cliente}`, {data: true}, { headers: headers });
  }
  
}
