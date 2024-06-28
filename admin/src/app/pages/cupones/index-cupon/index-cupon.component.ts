import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { CuponService } from '../../../services/cupon.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-cupon',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterLink, FormsModule, NgbPaginationModule, CommonModule],
  templateUrl: './index-cupon.component.html',
  styleUrl: './index-cupon.component.css'
})
export class IndexCuponComponent {
  public cupones: Array<any> = [];
  page = 1;
  pageSize= 5;
  public filtro_cupones: string = '';
  public token: string;

  constructor(private adminService: AdminService, private cuponService: CuponService){
    this.token = this.adminService.getToken() ?? '';
  }

  ngOnInit(): void {
    this.cuponService.listar_cupones_filtro_admin('codigo','', this.token).subscribe(
      (response) => {
        console.log(response);
        this.cupones = response.data;
        this.cupones.reverse();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  filtro(tipo: string): void {
    let filtroValor = tipo === 'codigo' ? this.filtro_cupones : '';
    this.cuponService.listar_cupones_filtro_admin(tipo, filtroValor,  this.token).subscribe(
      (response) => {
        this.cupones = response.data;
        this.cupones.reverse();
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
        this.cuponService.eliminar_cupon_admin(id, this.token).subscribe(
          response => {
            if (response.data) {
              Swal.fire(
                'Eliminado!',
                'El cupon ha sido eliminado.',
                'success'
              ).then(() => {
                this.cuponService.listar_cupones_filtro_admin('codigo','', this.token).subscribe(
                  (response) => {
                    console.log(response);
                    this.cupones = response.data;
                    this.cupones.reverse();
                  },
                  (error) => {
                    console.error(error);
                  }
                );
              });
              // this.router.navigate(['/panel/clientes']);
            } else {
              Swal.fire(
                'Error',
                'Hubo un problema al eliminar el cupon.',
                'error'
              );
            }
          },
          err => {
            console.error('Error al eliminar el cupon', err);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar el cupon.',
              'error'
            );
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'El cupon no ha sido eliminado.',
          'info'
        );
      }
    });
  }
}
