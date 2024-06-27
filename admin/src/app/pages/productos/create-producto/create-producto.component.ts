import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { ProductoService } from '../../../services/producto.service';
import { AdminService } from '../../../services/admin.service';

declare let iziToast: any;

@Component({
  selector: 'app-create-producto',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    FormsModule,
    RouterLink,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './create-producto.component.html',
  styleUrl: './create-producto.component.css',
})
export class CreateProductoComponent {
  public producto : any = { categoria: '' }; 
  public file : any = undefined;
  public imgSelect : any | ArrayBuffer = 'assets/imagen.jpg';
  token: string = '';

  constructor(private productoService: ProductoService, private adminService: AdminService, private router: Router){
    this.token = this.adminService.getToken() ?? '';
  }

  registro(registroForm: NgForm) {
    if (registroForm.valid) {
      if(this.file == undefined){
        iziToast.error({
          title: 'Error',
          message: 'Debes subir una portada para registrarte',
          position: 'topRight',
        });
      }else{
        if (this.file == undefined) {
          iziToast.error({
            title: 'Error',
            message: 'Debe subir una imagen de portada para registrar el producto',
            position: 'topRight',
          });
        }else{
          this.productoService.registro_producto_admin(this.producto, this.file, this.token).subscribe(
            response => {         
              iziToast.success({
                title: 'Ok',
                message: 'Se registró correctamente el nuevo producto',
                position: 'topRight',
              });
              this.router.navigate(['/panel/productos']);
            },
            error => {
              console.error('Error al registrar producto:', error);
            }
          );
        }
      }
    } else {
      iziToast.error({
        title: 'Error',
        message: 'Los datos del formulario no son válidos',
        position: 'topRight',
      });
    }
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
          const reader = new FileReader();
          reader.onload = (e) => (this.imgSelect = reader.result);
          reader.readAsDataURL(this.file);
          console.log(this.file);
        } else {
          iziToast.error({
            title: 'Error',
            message: 'El archivo debe ser una imagen',
            position: 'topRight',
          });
          this.imgSelect = 'assets/imagen.jpg';
          this.file = undefined;
        }
      } else {
        iziToast.error({
          title: 'Error',
          message: 'La imagen no puede superar los 4MB',
          position: 'topRight',
        });
        this.imgSelect = 'assets/imagen.jpg';
        this.file = undefined;
      }
    } else {
      iziToast.error({
        title: 'Error',
        message: 'No hay una imagen de envío',
        position: 'topRight',
      });
      this.imgSelect = 'assets/imagen.jpg';
      this.file = undefined;
    }
    console.log(this.file);
  }
}
