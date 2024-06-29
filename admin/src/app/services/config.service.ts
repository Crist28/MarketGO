import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Global } from '../environment/global.component';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public url;

  constructor( private http: HttpClient ) {
    this.url = Global.url;
  }

  actualizar_config_admin(id: any, data: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': token });
    
    if (data.logo) {
      const fd = new FormData();
      fd.append('titulo', data.titulo);
      fd.append('serie', data.serie);
      fd.append('correlativo', data.correlativo);
      fd.append('logo', data.logo);
  
      // Solo si hay categorías, las agregamos al FormData
      if (data.categorias.length > 0) {
        fd.append('categorias', JSON.stringify(data.categorias));
      }
  
      return this.http.put(this.url + 'actualizar_config_admin/' + id, fd, { headers });
    } else {
      const jsonData = {
        titulo: data.titulo,
        serie: data.serie,
        correlativo: data.correlativo,
        categorias: data.categorias,
      };
    
      const headersJson = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
      return this.http.put(this.url + 'actualizar_config_admin/' + id, jsonData, { headers: headersJson });
    }
  }

  obtener_config_admin(token: any):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.get(this.url + 'obtener_config_admin', { headers });
  }

  obtener_config_publico(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.url}obtener_config_publico`, { headers });
  }
}
