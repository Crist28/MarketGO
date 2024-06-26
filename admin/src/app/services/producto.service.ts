import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Global } from '../environment/global.component';
import { Producto } from '../interfaces/producto.interfaces'

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  public url;

  constructor(private http: HttpClient) {
    this.url = Global.url;
  }

  registro_producto_admin(data:any,file:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Authorization':token});
  
    const fd = new FormData();

    fd.append('titulo', data.titulo);
    fd.append('stock', data.stock);
    fd.append('precio', data.precio);
    fd.append('descripcion', data.descripcion);
    fd.append('contenido', data.contenido);
    fd.append('categoria', data.categoria);
    fd.append('portada', file);

    return this.http.post(this.url+'registro_producto_admin',fd,{headers:headers});
  }

  listar_productos_admin(tipo: any, filtro: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.get(`${this.url}listar_productos_admin/${tipo}/${filtro}`, {headers: headers});
  }
}
