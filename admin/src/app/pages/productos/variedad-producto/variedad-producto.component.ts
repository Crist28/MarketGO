import { Component } from '@angular/core';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { ProductoService } from '../../../services/producto.service';
import { AdminService } from '../../../services/admin.service';
import { VariedadService } from '../../../services/variedad.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';

import { Global } from '../../../environment/global.component';

declare let iziToast: any;

@Component({
  selector: 'app-variedad-producto',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './variedad-producto.component.html',
  styleUrl: './variedad-producto.component.css',
})
export class VariedadProductoComponent {
  public producto: any = {};
  public id: any;
  token: string = '';
  public nueva_variedad = '';
  public url;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private adminService: AdminService,
    private variedadService: VariedadService
  ) {
    this.token = this.adminService.getToken() ?? '';
    this.url = Global.url;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.productoService
        .obtener_producto_admin(this.id, this.token)
        .subscribe(
          (response) => {
            if (response.data == undefined) {
              this.producto = undefined;
            } else {
              this.producto = response.data;
            }
            console.log(this.producto);
          },
          (error) => {
            console.log(error);
          }
        );
    });
  }

  agregar_variedad() {
    if (this.nueva_variedad) {
      this.producto.variedades.push({
        titulo: this.nueva_variedad,
      });
      this.nueva_variedad = '';
      this.producto.variedades.reverse();
    } else {
      iziToast.error({
        title: 'Error',
        message: 'El campo de la variedad debe ser completada',
        position: 'topRight',
      });
    }
  }

  eliminar_variedades(idx: any) {
    this.producto.variedades.splice(idx, 1);
  }

  actualizar() {
    if (this.producto.titulo_variedad) {
      if (this.producto.variedades.length >= 1) {
        this.variedadService.actualizar_producto_variedades_admin({
          titulo_variedad: this.producto.titulo_variedad,
          variedades: this.producto.variedades,
        }, this.id, this.token).subscribe(
          response => {
            console.log(response);
            iziToast.success({
              title: 'Successo',
              message: 'Se guardo correctamente las variedades',
              position: 'topRight',
            });
          },
          error => {
            iziToast.error({
              title: 'Error',
              message: 'No se pudo actualizar el producto',
              position: 'topRight',
            });
          }
        );
      } else {
        iziToast.error({
          title: 'Error',
          message: 'Se debe agregar al menos una veriedad',
          position: 'topRight',
        });
      }
    } else {
      iziToast.error({
        title: 'Error',
        message: 'El campo titulo debe ser completada',
        position: 'topRight',
      });
    }
  }
}
