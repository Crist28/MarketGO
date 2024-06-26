import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Global } from '../environment/global.component';
import { User, RegistrarUsuarioAdmin, Cliente } from '../interfaces/cliente.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  public url;

  constructor( private http: HttpClient ) {
    this.url = Global.url;
  }

  listar_cliente_filtro_admin(tipo: string, filtro: string, token: string): Observable<{ data: User[] }> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.get<{ data: User[] }>(`${this.url}listar_cliente_filtro_admin/${tipo}/${filtro}`, { headers: headers });
  }
  
  registro_cliente_admin(data: RegistrarUsuarioAdmin): Observable<{ data: User[] }> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': data.token  // Usar el token del objeto data recibido
    });
    return this.http.post<{ data: User[] }>(`${this.url}registro_cliente_admin`, data.admin, { headers: headers });
  }  

  obtener_cliente_admin(id: string, token: string): Observable<{ data: Cliente }> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.get<{ data: Cliente }>(`${this.url}/obtener_cliente_admin/${id}`, { headers: headers });
  }

  actualizar_cliente_admin(id: string, data: Cliente, token: string): Observable<{ data: Cliente }> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.put<{ data: Cliente }>(`${this.url}/actualizar_cliente_admin/${id}`, data, { headers: headers });
  }

  eliminar_cliente_admin(id: string, token: string): Observable<{ data: Cliente }> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.delete<{ data: Cliente }>(`${this.url}/eliminar_cliente_admin/${id}`, { headers: headers });
  }
}
