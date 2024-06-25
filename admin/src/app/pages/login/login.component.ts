import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AdminService } from '../../services/admin.service';
import { User, Admin } from '../../interfaces/login.interfaces';

declare let iziToast: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  user: User = { email: '', password: '' };
  usuario: Admin | null = null;
  token: string;
  passwordFieldType: string = 'password';
  
  constructor(private adminService: AdminService, private router: Router) {
    const token = this.adminService.getToken();
    this.token = token !== null ? token : '';
  }

  ngOnInit(): void {
    if (this.token) {
      this.router.navigate(['']);
    }
  }

  togglePasswordVisibility(event: any) {
    this.passwordFieldType = event.target.checked ? 'text' : 'password';
  }

  login(loginForm: NgForm) {
    let data = {
      email: this.user.email,
      password: this.user.password,
    };
    if (loginForm.valid) {
      this.adminService.login_admin(data).subscribe(
        (response) => {
          this.usuario = response.data.admin;

          localStorage.setItem('token', response.data.token);
          localStorage.setItem('id', response.data.admin._id);
          localStorage.setItem('nombre', response.data.admin.nombres);

          this.router.navigate(['']);
        },
        (error) => {
          iziToast.error({
            title: 'Error',
            message: 'No se encontro el correo o la contraseña',
            position: 'topRight',
          });
        }
      );
    } else {
      iziToast.error({
        title: 'Error',
        message: 'Los datos del formulario no son validos',
        position: 'topRight',
      });
    }
  }
}
