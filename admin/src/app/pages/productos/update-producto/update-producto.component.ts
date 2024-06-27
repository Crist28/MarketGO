import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { ProductoService } from '../../../services/producto.service';
import { AdminService } from '../../../services/admin.service';
import { Global } from '../../../environment/global.component';

import Swal from 'sweetalert2';

declare const jQuery: any;
declare const $: any;
declare let iziToast: any;

@Component({
  selector: 'app-update-producto',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    FormsModule,
    RouterLink,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './update-producto.component.html',
  styleUrl: './update-producto.component.css',
})
export class UpdateProductoComponent {
  public producto: any = { categoria: '' };
  public config: any = {};
  public imgSelect: any | ArrayBuffer;
  public file: File | any = undefined;
  public url;
  public id: any;
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private adminService: AdminService
  ) {
    this.config = { heigth: 500 };
    this.url = Global.url;
    this.token = this.adminService.getToken() ?? '';
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.productoService.obtener_producto_admin(this.id, this.token).subscribe(
        response => {
          if (response.data == undefined) {
            this.producto = undefined;
          } else {
            this.producto = response.data;
            this.imgSelect = this.url + 'obtener_portada/' + this.producto.portada;
          }
        }, error => {
          console.log(error);
        }
      );
    });
  }

  fileChangeEvent(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];

      // Condicionales para el tamaño y tipo de archivo
      if (this.file.size <= 4000000) {
        if (
          this.file.type == 'image/png' ||
          this.file.type == 'image/webp' ||
          this.file.type == 'image/jpg' ||
          this.file.type == 'image/jpeg' ||
          this.file.type == 'image/gif'
        ) {
          const reader = new FileReader();
          reader.onload = (e) => (this.imgSelect = reader.result);
          reader.readAsDataURL(this.file);

          $('#input-portada').text(this.file.name);
        } else {
          iziToast.error({
            title: 'Error',
            message: 'El archivo debe ser una imagen',
            position: 'topRight',
          });
          $('#input-portada').text('Seleccionar imagen');
          this.imgSelect = 'assets/imagen.jpg';
          this.file = undefined;
        }
      } else {
        iziToast.error({
          title: 'Error',
          message: 'La imagen no puede superar los 4MB',
          position: 'topRight',
        });
        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect = 'assets/imagen.jpg';
        this.file = undefined;
      }
    } else {
      iziToast.error({
        title: 'Error',
        message: 'No hay imagen de envio',
        position: 'topRight',
      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/imagen.jpg';
      this.file = undefined;
    }
  }

  actualizar(actualizarForm: NgForm) {
    if (actualizarForm.valid) {
      // Crear un objeto para almacenar los datos del producto
      const productoActualizado = {
        _id: this.producto._id,
        titulo: this.producto.titulo,
        stock: this.producto.stock,
        precio: this.producto.precio,
        descripcion: this.producto.descripcion,
        contenido: this.producto.contenido,
        categoria: this.producto.categoria,
        portada: this.file instanceof File ? this.file : this.producto.portada,
      };
  
      // Verificar si hay una nueva imagen seleccionada y no es la imagen de fallback
      const imagenFallback = this.url + 'obtener_portada/default.jpg';
      const imagenActual = this.imgSelect;
      const nuevaImagenSeleccionada = this.file && imagenActual !== imagenFallback;
  
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      });
  
      swalWithBootstrapButtons.fire({
        title: '¿Quieres modificar el producto?',
        text: "Podrías perder la información anterior.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, modificarlo!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.productoService.actualizar_producto_admin(productoActualizado, this.producto._id, this.token).subscribe(
            (response) => {
              if (nuevaImagenSeleccionada) {
                // Si se seleccionó una nueva imagen, mostrar el mensaje de éxito y cargar la nueva imagen
                iziToast.success({
                  title: 'Ok',
                  message: 'Se actualizó el producto',
                  position: 'topRight',
                });
  
                this.router.navigate(['/panel/productos']);
              } else {
                // Si no se seleccionó una nueva imagen, mostrar solo el mensaje de éxito
                iziToast.success({
                  title: 'Ok',
                  message: 'Se actualizó el producto',
                  position: 'topRight',
                });
  
                this.router.navigate(['/panel/productos']);
              }
            },
            (error) => {
              console.log(error);
              swalWithBootstrapButtons.fire(
                'Error',
                'Hubo un problema al actualizar el producto.',
                'error'
              );
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'El registro del producto no ha sido modificado.',
            'info'
          );
        }
      });
    } else {
      iziToast.error({
        title: 'Error',
        message: 'No se actualizó el producto',
        position: 'topRight',
      });
    }
  }
  
}
