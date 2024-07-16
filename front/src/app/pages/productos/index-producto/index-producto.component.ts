import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { GuestService } from '../../../services/guest.service';
import { Global } from '../../../environment/global.component';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

declare let iziToast: any;

// declare let noUiSlider: any;
declare let $: any;

@Component({
  selector: 'app-index-producto',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule, NgbPaginationModule, RouterLink],
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css'] // Cambiado a styleUrls
})
export class IndexProductoComponent {
  public config_global: any = {};
  public filter_categoria = '';
  public productos: Array<any> = [];
  public route_categoria:any;
  public filter_producto = '';
  public url;
  public filter_cat_productos = 'todos';
  public sort_by = 'Defecto';
  page = 1;
  pageSize= 20;
  public carrito_data: any = {
    variedad: '',
    cantidad: 1
  };
  public btn_crt = false;
  public token: string;


  constructor(private clienteService: ClienteService, private guestService: GuestService, private route: ActivatedRoute, private router: Router){
    this.url = Global.url;
    const token = this.clienteService.getToken();
    this.token = token !== null ? token : '';
    this.clienteService.obtener_config_publico().subscribe(
      response =>{
        
        this.config_global = response.data;
      },
      error =>{

      }
    )
    this.route.params.subscribe(params => {
      this.route_categoria = params['categoria'];
      if (this.route_categoria) {
        this.guestService.listar_productos_public('').subscribe(
          (response) => {
            // Filtrar productos por categoría
            this.productos = response.data.filter(
              (item: any) => item.categoria.toLowerCase() === this.route_categoria.toLowerCase()
            );
          },
          (error) => {
            console.error('Error al cargar productos:', error);
            // Aquí puedes decidir cómo manejar el error, por ejemplo, mostrando un mensaje al usuario
          }
        );
      } else {
        // Si no hay categoría en los parámetros, cargar todos los productos
        this.guestService.listar_productos_public('').subscribe(
          (response) => {
            this.productos = response.data;
          },
          (error) => {
            console.error('Error al cargar productos:', error);
            // Aquí también puedes manejar el error
          }
        );
      }
    });    
  }


  ngOnInit(): void {}

  onPageChange(newPage: number): void {
    this.pageSize = newPage;
  }

  buscar_categoria() {
    if (this.filter_categoria) {
      const search = new RegExp(this.filter_categoria, 'i');
      this.config_global.categorias = this.config_global.categorias.filter(
        (item: { titulo: string }) => search.test(item.titulo)
      );
    } else {
      this.clienteService.obtener_config_publico().subscribe((response) => {
        this.config_global = response.data;
      });
    }
  }

  reset_productos(){
    this.filter_producto = '';
    this.guestService.listar_productos_public('').subscribe(
      response=>{
        this.productos = response.data;
      }
    );
  }

  buscar_producto() {
    this.guestService
      .listar_productos_public(this.filter_producto)
      .subscribe((response) => {
        this.productos = response.data;
  
        // Mostrar mensaje si no hay resultados
        if (this.productos.length === 0) {
          // Reiniciar otros filtros si es necesario
        } else {
          // Ocultar mensaje si hay resultados
          this.filter_producto = ''; // Reiniciar el filtro de búsqueda
        }
      });
  }

  buscar_por_categoria() {
    if (this.filter_cat_productos == 'todos') {
      this.guestService
        .listar_productos_public(this.filter_producto)
        .subscribe((response) => {
          this.productos = response.data;
        });
    } else {
      this.guestService
        .listar_productos_public(this.filter_producto)
        .subscribe((response) => {
          this.productos = response.data;
          this.productos = this.productos.filter(
            (item) => item.categoria === this.filter_cat_productos
          );
        });
    }
  }

  loadProductos(): void {
    this.filter_cat_productos = 'todos'; // Restablecer filtro de categoría
    this.filter_categoria = ''; // Limpiar filtro de categoría
    this.guestService.listar_productos_public('').subscribe(
      (response) => {
        this.productos = response.data;
        this.orden_por(); // Aplicar orden a los productos
      },
      (error) => {
        console.log(error);
      }
    );
  }

  orden_por(){
    if(this.sort_by == 'Defecto'){
      this.guestService
        .listar_productos_public(this.filter_producto)
        .subscribe((response) => {
          this.productos = response.data;
        });
    }else if (this.sort_by === 'Popularity') {
      this.productos.sort((a, b) => { // Fixed parentheses here
        if (a.nventas < b.nventas) {
          return 1;
        }
        if (a.nventas > b.nventas) { // Fixed comparison operator here
          return -1;
        }
        return 0;
      });
    }else if (this.sort_by === 'precio_mayor') {
      this.productos.sort((a, b) => { // Fixed parentheses here
        if (a.precio < b.precio) {
          return 1;
        }
        if (a.precio > b.precio) { // Fixed comparison operator here
          return -1;
        }
        return 0;
      });
    }
    else if (this.sort_by === 'precio_menor') {
      this.productos.sort((a, b) => { // Fixed parentheses here
        if (a.precio > b.precio) {
          return 1;
        }
        if (a.precio < b.precio) { // Fixed comparison operator here
          return -1;
        }
        return 0;
      });
    }
    else if (this.sort_by === 'azTitulo') {
      this.productos.sort((a, b) => { // Fixed parentheses here
        if (a.titulo > b.titulo) {
          return 1;
        }
        if (a.titulo < b.titulo) { // Fixed comparison operator here
          return -1;
        }
        return 0;
      });
    }
    else if (this.sort_by === 'zaTitulo') {
      this.productos.sort((a, b) => { // Fixed parentheses here
        if (a.titulo < b.titulo) {
          return 1;
        }
        if (a.titulo > b.titulo) { // Fixed comparison operator here
          return -1;
        }
        return 0;
      });
    }
  }

  agregar_producto(producto: any) {
    console.log('Producto:', producto);
  
    // Verificar si el producto tiene variedades y si hay al menos una variedad
    if (producto.variedades && producto.variedades.length > 0) {
      let data = {
        producto: producto._id,
        cliente: localStorage.getItem('id'),
        cantidad: 1,
        variedad: producto.variedades[0].titulo
      }
      console.log('Data para enviar:', data);
  
      this.btn_crt = true;
      this.clienteService.agregar_carrito_cliente(data, this.token).subscribe(
        response => {
          if (response.data == undefined) {
            iziToast.error({
              title: 'Error',
              message: 'El producto ya existe en el carrito',
              position: 'topRight',
            });
            this.btn_crt = false; 
          } else {
            console.log(response);
            iziToast.success({
              title: 'OK',
              message: 'Se agregó el producto al carrito',
              position: 'topRight',
            });
            this.btn_crt = false; 
            this.router.navigate(['/productos']).then(() => {
              window.location.reload();
            });
          }
        }, 
        error => {
          console.error(error);
          iziToast.error({
            title: 'Error',
            message: 'Ocurrió un error al agregar el producto al carrito',
            position: 'topRight',
          });
          this.btn_crt = false;
        }
      )
    } else {
      iziToast.error({
        title: 'Error',
        message: 'El producto no tiene variedades disponibles',
        position: 'topRight',
      });
    }
  }
  
}
