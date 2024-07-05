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
}
