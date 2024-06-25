import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { ClienteService } from '../../../services/cliente.service';
import { User } from '../../../interfaces/cliente.interfaces';
import { AdminService } from '../../../services/admin.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-cliente',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, CommonModule, FormsModule, NgbPaginationModule, RouterLink, RouterOutlet],
  templateUrl: './index-cliente.component.html',
  styleUrl: './index-cliente.component.css'
})
export class IndexClienteComponent {
  public filtro_nombres: string = '';
  public filtro_correo: string = '';
  clientes: User[] = [];  
  page = 1;
  pageSize= 20;
  public token: string;
  load_data = true;

  constructor(private clienteService: ClienteService, private adminService: AdminService, private router: Router) {
    this.token = this.adminService.getToken() ?? '';
  }

  ngOnInit(): void {
    this.clienteService.listar_cliente_filtro_admin('nombres','', this.token).subscribe(
      (response) => {
        this.clientes = response.data;
        this.clientes.reverse();
        this.load_data = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  filtro(tipo: string): void {
    let filtroValor = tipo === 'nombres' ? this.filtro_nombres : this.filtro_correo;
    this.clienteService.listar_cliente_filtro_admin(tipo, filtroValor, this.token).subscribe(
      (response) => {
        this.clientes = response.data;
        this.clientes.reverse();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  eliminar(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.eliminar_cliente_admin(id, this.token).subscribe(
          response => {
            if (response.data) {
              Swal.fire(
                'Eliminado!',
                'El cliente ha sido eliminado.',
                'success'
              ).then(() => {
                window.location.reload();
              });
              // this.router.navigate(['/panel/clientes']);
            } else {
              Swal.fire(
                'Error',
                'Hubo un problema al eliminar el cliente.',
                'error'
              );
            }
          },
          err => {
            console.error('Error al eliminar el cliente', err);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar el cliente.',
              'error'
            );
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'El cliente no ha sido eliminado.',
          'info'
        );
      }
    });
  }
}
