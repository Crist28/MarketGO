import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Global } from '../environment/global.component';

@Injectable({
  providedIn: 'root'
})
export class VariedadService {
  public url;

  constructor(private http: HttpClient) {
    this.url = Global.url;
  }

  actualizar_producto_variedades_admin(data: any, id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':token
    });
    return this.http.put(this.url + 'actualizar_producto_variedades_admin/'+id,data,{headers:headers});
  }
}
