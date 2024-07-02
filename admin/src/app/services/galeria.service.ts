import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Global } from '../environment/global.component';

@Injectable({
  providedIn: 'root'
})
export class GaleriaService {
  public url;

  constructor(private http: HttpClient) {
    this.url = Global.url;
  }

  agregar_imagen_galeria_admin(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Authorization':token});

    const fd = new FormData();
    fd.append('_id',data._id);
    fd.append('imagen',data.imagen);
    console.log("fs:",fd);
    return this.http.put(this.url+'agregar_imagen_galeria_admin/'+id,fd,{headers:headers});
  }

  eliminar_imagen_galeria_admin(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this.http.put(this.url+'eliminar_imagen_galeria_admin/'+id,data,{headers:headers});
  }
}
