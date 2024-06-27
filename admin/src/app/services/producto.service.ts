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

  obtener_producto_admin(id: any, token: any):Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':token
    });
    return this.http.get(this.url + 'obtener_producto_admin/'+id,{headers:headers});
  }

  actualizar_producto_admin(producto: any, id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': token });
  
    const fd = new FormData();
    fd.append('titulo', producto.titulo);
    fd.append('stock', producto.stock);
    fd.append('precio', producto.precio);
    fd.append('descripcion', producto.descripcion);
    fd.append('contenido', producto.contenido);
    fd.append('categoria', producto.categoria);
  
    // Verificar si se seleccionó una nueva imagen
    if (producto.portada instanceof File) {
      // Agregar la nueva imagen al FormData
      fd.append('portada', producto.portada, producto.portada.name);
    } else {
      // Si no se seleccionó una nueva imagen, enviar solo el nombre de la imagen actualizada
      fd.append('portadaActualizada', producto.portada);
    }
  
    return this.http.put(this.url + 'actualizar_producto_admin/' + id, fd, { headers });
  }

  eliminar_producto_admin(id: any, token: any):Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':token
    });
    return this.http.delete(this.url + 'eliminar_producto_admin/'+id,{headers:headers});
  }
}
