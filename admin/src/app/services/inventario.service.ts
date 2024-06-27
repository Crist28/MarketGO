import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Global } from '../environment/global.component';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  public url;

  constructor(private http: HttpClient) {
    this.url = Global.url;
  }

  listar_inventario_producto_admin(id: any, token: any):Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':token
    });
    return this.http.get(this.url + 'listar_inventario_producto_admin/'+id,{headers:headers});
  }

  eliminar_inventario_producto_admin(id: any, token: any):Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':token
    });
    return this.http.delete(this.url + 'eliminar_inventario_producto_admin/'+id,{headers:headers});
  }

  registro_inventario_producto_admin(data: any, token: any):Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':token
    });
    return this.http.post(this.url + 'registro_inventario_producto_admin/',data,{headers:headers});
  }
}
