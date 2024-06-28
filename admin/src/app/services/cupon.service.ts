import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Global } from '../environment/global.component';

@Injectable({
  providedIn: 'root'
})
export class CuponService {
  public url;

  constructor( private http: HttpClient ) {
    this.url = Global.url;
  }

  registro_cupon_admin(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token 
    });
    return this.http.post(`${this.url}registro_cupon_admin`, data, { headers: headers });
  }

  listar_cupones_filtro_admin(tipo: string, filtro: any, token: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    // Puedes ajustar la URL y pasar el filtro como un parámetro de consulta si es necesario
    return this.http.get(`${this.url}listar_cupones_filtro_admin/${tipo}?filtro=${filtro}`, { headers: headers });
  }

  obtener_cupon_admin(id: string, token: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.get<any>(`${this.url}obtener_cupon_admin/${id}`, { headers: headers });
  }

  actualizar_cupon_admin(id: string, data: any, token: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.put(`${this.url}actualizar_cupon_admin/${id}`, data, { headers: headers });
  }

  eliminar_cupon_admin(id: string, token: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.delete(`${this.url}eliminar_cupon_admin/${id}`, { headers: headers });
  }  
}
