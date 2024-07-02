import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Global } from '../../../environment/global.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { AdminService } from '../../../services/admin.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { GaleriaService } from '../../../services/galeria.service';

import { v4 as uuidv4 } from 'uuid';

import Swal from 'sweetalert2';

declare const jQuery: any;
declare const $: any;
declare let iziToast: any;

@Component({
  selector: 'app-galeria-producto',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, RouterLink, CommonModule],
  templateUrl: './galeria-producto.component.html',
  styleUrl: './galeria-producto.component.css',
})
export class GaleriaProductoComponent {
  public producto: any = {};
  public id: any;
  public token;

  public file: File | any = undefined;
  public url;

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private galeriaService: GaleriaService
  ) {
    this.token = this.adminService.getToken() ?? '';
    this.url = Global.url;
  }

  ngOnInit(): void {
    this.init_data();
  }

  fileChangeEvent(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      console.log(this.file);

      // Condicionales para el tamaño y tipo de archivo
      if (this.file.size <= 4000000) {
        if (
          this.file.type == 'image/png' ||
          this.file.type == 'image/webp' ||
          this.file.type == 'image/jpg' ||
          this.file.type == 'image/jpeg' ||
          this.file.type == 'image/gif'
        ) {
        } else {
          iziToast.error({
            title: 'Error',
            message: 'El archivo debe ser una imagen',
            position: 'topRight',
          });
          $('#input-img').val('');
          this.file = undefined;
        }
      } else {
        iziToast.error({
          title: 'Error',
          message: 'La imagen no puede superar los 4MB',
          position: 'topRight',
        });
        $('#input-img').val('');
        this.file = undefined;
      }
    } else {
      iziToast.error({
        title: 'Error',
        message: 'No hay una imagen de envío',
        position: 'topRight',
      });
      $('#input-img').val('');
      this.file = undefined;
    }
  }

  init_data(){
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

  subir_imagen() {
    if(this.file != undefined){
      let data = {
        imagen: this.file,
        _id: uuidv4()
      }
      this.galeriaService.agregar_imagen_galeria_admin(this.id,data,this.token).subscribe(
        response=>{
          iziToast.success({
            title: 'Ok',
            message: 'Se registró correctamente la nueva imagen',
            position: 'topRight',
          });
          this.init_data();
          $('#input-img').val('');
          console.log('mensaje de prueba:',response);
        },
        error=>{
          console.log(error);
        }
      );
    }else{
      iziToast.error({
        title: 'Error',
        message: 'Debe seleccionar una imagen para subir',
        position: 'topRight',
      });
    }
  }

  eliminar(id: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Esta acción no se puede deshacer!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.galeriaService.eliminar_imagen_galeria_admin(this.id, { _id: id }, this.token).subscribe(
          response => {
            iziToast.success({
              title: 'Ok',
              message: 'Se eliminó correctamente la imagen.',
              position: 'topRight',
            });
  
            $('#delete-' + id).modal('hide');
            $('.modal-backdrop').removeClass('show');
  
            this.init_data();
          },
          error => {
            iziToast.error({
              title: 'Error',
              message: 'Ocurrió un error en el servidor.',
              position: 'topRight',
            });
            console.log(error);
          }
        );
      }
    });
  }
  
}
