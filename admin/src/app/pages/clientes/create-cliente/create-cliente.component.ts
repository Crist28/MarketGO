import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { Cliente } from '../../../interfaces/cliente.interfaces';
import { ClienteService } from '../../../services/cliente.service';
import { AdminService } from '../../../services/admin.service';
import { RegistrarUsuarioAdmin } from '../../../interfaces/cliente.interfaces';

declare let iziToast: any;

@Component({
  selector: 'app-create-cliente',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    FormsModule,
    RouterLink,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './create-cliente.component.html',
  styleUrl: './create-cliente.component.css',
})
export class CreateClienteComponent {
  cliente: Cliente = {
    nombres: '',
    apellidos: '',
    pais: '',
    email: '',
    password: '',
    perfil: 'perfil.png',
    telefono: '',
    genero: '',
    f_nacimiento: '',
    dni: '',
  };
  token: string = '';

  constructor(private clienteService: ClienteService, private adminService: AdminService, private router: Router){
    this.token = this.adminService.getToken() ?? '';
  }

  registro(registroForm: NgForm) {
    if (registroForm.invalid) {
      iziToast.error({
        title: 'Error',
        message: 'Los datos del formulario no son válidos',
        position: 'topRight',
      });
    } else {
      const data: RegistrarUsuarioAdmin = {
        admin: this.cliente,
        token: this.token,
      };

      this.clienteService.registro_cliente_admin(data).subscribe(
        response => {
          iziToast.success({
            title: 'OK',
            message: 'Se registro correctamente el cliente',
            position: 'topRight',
        });
        this.cliente = {
          nombres: '',
          apellidos: '',
          pais: '',
          email: '',
          password: '',
          perfil: 'perfil.png',
          telefono: '',
          genero: '',
          f_nacimiento: '',
          dni: '',
        };
        this.router.navigate(['/panel/clientes']);
        },
        error => {
          console.error('Error al registrar cliente:', error);
          // Manejar el error de alguna manera (mostrar mensaje, etc.)
        }
      );
    }
  }
}
