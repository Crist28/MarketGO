import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Router } from '@angular/router';

import { FormsModule, NgForm } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';

declare let iziToast: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public user: any = {}
  public token: string;
  public usuario: any | null = null;
  passwordFieldType: string = 'password';

  constructor(private clienteService: ClienteService, private router: Router){
    const token = this.clienteService.getToken();
    this.token = token !== null ? token : '';
  }

  login(loginForm: NgForm){
    let data = {
      email: this.user.email,
      password: this.user.password,
    }
    if(loginForm.valid){
      this.clienteService.login_cliente(data).subscribe(
        response => {
          console.log(response);
          this.usuario = response.data.cliente;

          localStorage.setItem('token', response.data.token);
          localStorage.setItem('id', response.data.cliente._id);
          localStorage.setItem('nombre', response.data.cliente.nombres);

          this.router.navigate(['']);
        },
        error => {
          iziToast.error({
            title: 'Error',
            message: 'No se encontro el correo o la contraseña',
            position: 'topRight',
          });
        }
      )
    }else{
      iziToast.error({
        title: 'Error',
        message: 'Los datos del formulario no son validos',
        position: 'topRight',
      });
    }
  }

  togglePasswordVisibility(event: any) {
    this.passwordFieldType = event.target.checked ? 'text' : 'password';
  }
}
