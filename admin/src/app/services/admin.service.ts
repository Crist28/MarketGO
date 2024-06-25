import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Global } from '../environment/global.component';
import { LoginData, LoginResponse } from '../interfaces/admin.interfaces';

declare let iziToast: any;

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public url;

  constructor( private http: HttpClient ) {
    this.url = Global.url;
  }

  login_admin(data: LoginData): Observable<LoginResponse> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<LoginResponse>(this.url + 'login_admin', data, {headers: headers});
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    } else {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
  
    if (!token) {
      if (typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
      return false;
    }
  
    try {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
  
      if (!decodedToken || helper.isTokenExpired(token)) {
        if (typeof localStorage !== 'undefined') {
          localStorage.clear();
        }
        return false;
      }
  
      if (decodedToken.role !== 'admin') {
        iziToast.error({
          title: 'Error',
          message: 'El usuario no es tipo administrador',
          position: 'topRight',
        });
        localStorage.clear();
        return false;
      }
    } catch (error) {
      console.log(error);
      if (typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
      return false;
    }
  
    return true;
  }
}
