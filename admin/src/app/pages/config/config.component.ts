import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { AdminService } from '../../services/admin.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { MatIconModule } from '@angular/material/icon';

import { v4 as uuidv4 } from 'uuid';
import { Global } from '../../environment/global.component';

declare const jQuery: any;
declare const $: any;
declare let iziToast: any;

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, FormsModule, MatIconModule, CommonModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent {
  public token: string;
  public file: File | any;
  public imgSelect : any | ArrayBuffer = 'assets/imagen.jpg';
  public id: any;
  public url;
  public config: any = {
    categorias: []
  };
  public titulo_cat: '' | any;
  public icono_cat: '' | any;

  constructor(private adminService: AdminService,private configService: ConfigService, private router: Router) {
    this.token = this.adminService.getToken() ?? '';
    this.url = Global.url;
  }

  ngOnInit(): void {
    this.configService.obtener_config_admin(this.token).subscribe(
      response => {
        if (response.data && response.data.length > 0) {
          this.config = response.data[0];
          this.id = this.config._id;
          if (this.config.logo) {
            this.imgSelect = this.url + 'obtener_logo/' + this.config.logo;
          }else{
            this.imgSelect = 'assets/imagen.jpg';
          }
        }
      },
      error =>{
        console.log(error);
      }
    )
  }

  agregar_cat(){
    if(this.icono_cat && this.titulo_cat){
      console.log(uuidv4());
      this.config.categorias.push({
        icono: this.icono_cat,
        titulo: this.titulo_cat,
        _id: uuidv4()
      });
      this.titulo_cat = '';
      this.icono_cat= '';
    }else{
      iziToast.error({
        title: 'Error',
        message: 'Debe ingresar un titulo e icono para la categoria.',
        position: 'topRight',
      });
    }
  }

  actualizar(confForm: NgForm){
    if(confForm.valid){
      console.log('Titulo:', this.config.titulo);
      console.log('Serie:', this.config.serie);
      console.log('Correlativo:', this.config.correlativo);
      let data = {
        titulo: this.config.titulo,
        serie: this.config.serie,
        correlativo: this.config.correlativo,
        categorias: this.config.categorias,
        logo: this.file
      };
      this.configService.actualizar_config_admin('668001eb288bc44a7f846ef6', data, this.token).subscribe(
        response => {
          console.log(response);
          iziToast.success({
            title: 'Ok',
            message: 'Configuración actualizada correctamente.',
            position: 'topRight',
          });
        },
        error => {
          console.log(error);
        }
      )
    }else{
      iziToast.error({
        title: 'Error',
        message: 'Complete correctamente el formulario.',
        position: 'topRight',
      });
    }
  }

  fileChangeEvent( event: any ): void{
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
  
      // Condicionales para el tamaño y tipo de archivo
      if (this.file.size <= 4000000) {
        if (
          this.file.type == 'image/png'   ||
          this.file.type == 'image/webp'  ||
          this.file.type == 'image/jpg'   ||
          this.file.type == 'image/jpeg'  ||
          this.file.type == 'image/gif'
        ) {
          const reader = new FileReader();
          reader.onload = (e) => (this.imgSelect = reader.result);
          $('.cs-file-drop-icon').addClass('cs-file-drop-preview img-thumbnail rounded');
          $('.cs-file-drop-icon').removeClass('cs-file-drop-icon cxi-upload');
          reader.readAsDataURL(this.file);
  
          $('#input-portada').text(this.file.name);
        } else {
          iziToast.error({
            title: 'Error',
            message: 'El archivo debe ser una imagen.',
            position: 'topRight',
          });
          $('#input-portada').text('Seleccionar imagen');
          this.imgSelect = 'assets/imagen.jpg';
          this.file = undefined;
        }
      } else {
        iziToast.error({
          title: 'Error',
          message: 'La imagen no debe superar los 4MB.',
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
  ngDoCheck():void{
    $('.cs-file-drop-preview').html("<img src="+this.imgSelect+">");
  }

  eliminar_categoria(idx: any){
    this.config.categorias.splice(idx,1);
  }
}
