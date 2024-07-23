import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Global } from '../environment/global.component';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  public url;

  constructor(private http: HttpClient) {
    this.url = Global.url;
  }

  listar_productos_public(filtro:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.url}listar_productos_public/`+filtro, { headers });
  }

  obtener_productos_slug_public(slug:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.url}obtener_productos_slug_public/`+slug, { headers });
  }

  listar_productos_recomendados_public(categoria:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.url}listar_productos_recomendados_public/`+categoria, { headers });
  }

  get_Regiones(): Observable<any> {
    return this.http.get('../../../public/regiones.json');
  }
  get_Provincias(): Observable<any> {
    return this.http.get('../../../public/provincias.json');
  }
  get_Distritos(): Observable<any> {
    return this.http.get('../../../public/distritos.json');
  }
}
