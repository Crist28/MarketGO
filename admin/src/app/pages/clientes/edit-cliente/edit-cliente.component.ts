import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';

import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { Cliente } from '../../../interfaces/cliente.interfaces';
import { ClienteService } from '../../../services/cliente.service';
import { AdminService } from '../../../services/admin.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-cliente',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    FormsModule,
    RouterLink,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './edit-cliente.component.html',
  styleUrl: './edit-cliente.component.css',
})
export class EditClienteComponent {
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
  public id: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private adminService: AdminService,
    private router: Router
  ) {
    this.token = this.adminService.getToken() ?? '';
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.clienteService.obtener_cliente_admin(this.id, this.token).subscribe(
          (resp) => {
            if (resp.data != undefined) {
              this.cliente = resp.data as Cliente;
            } else {
              console.error('No data found');
            }
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        console.error('ID is undefined');
      }
    });
  }

  actualizar(actualizarForm: NgForm) {
    if (actualizarForm.valid) {
      if (this.id) {
        this.clienteService.actualizar_cliente_admin(this.id, this.cliente, this.token).subscribe(
          response => {
            console.log(response);
            if (response.data) {
              const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: 'btn btn-success',
                  cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
              });
          
              swalWithBootstrapButtons.fire({
                title: '¿Quieres modificar el cliente?',
                text: "Podrías perder la información anterior.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, modificarlo!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: true
              }).then((result) => {
                if (result.isConfirmed) {
                  if(this.id){
                    this.clienteService.actualizar_cliente_admin(this.id, this.cliente, this.token).subscribe(
                      () => {
                        swalWithBootstrapButtons.fire(
                          '¡Cliente actualizado!',
                          'El cliente ha sido modificado exitosamente.',
                          'success'
                        );
                        this.router.navigate(['/panel/clientes']);
                      },
                      err => {
                        console.error('Error al actualizar el cliente', err);
                        swalWithBootstrapButtons.fire(
                          'Error',
                          'Hubo un problema al actualizar el cliente.',
                          'error'
                        );
                      }
                    );
                  }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  swalWithBootstrapButtons.fire(
                    'Cancelado',
                    'El registro del cliente no ha sido modificado.',
                    'info'
                  );
                }
              });
            } else {
              console.error('No se pudo actualizar el cliente');
            }
          },
          err => {
            console.error('Error al actualizar el cliente', err);
          }
        );
      } else {
        console.error('ID is undefined');
      }
    } else {
      console.error('Formulario inválido');
    }
  }
  
}
