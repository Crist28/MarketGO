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
import { ProductoService } from '../../../services/producto.service';
import { Global } from '../../../environment/global.component';

import { Workbook } from 'exceljs';
import { saveAs  } from 'file-saver';

@Component({
  selector: 'app-index-producto',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, CommonModule, FormsModule, NgbPaginationModule, RouterLink, RouterOutlet],
  templateUrl: './index-producto.component.html',
  styleUrl: './index-producto.component.css'
})
export class IndexProductoComponent {
  public filtro_titulo: string = '';
  public filtro_categoria: string = '';
  public productos: Array<any> = [];
  public arr_producto: Array<any> = [];
  page = 1;
  pageSize= 20;
  token: string = '';
  public url;

  constructor(private productoService: ProductoService, private adminService: AdminService ){
    this.token = this.adminService.getToken() ?? '';
    this.url = Global.url;
  }

  ngOnInit(): void {
    this.productoService.listar_productos_admin('titulo', '', this.token).subscribe(
      (response) => {
        this.productos = response.data;
        this.productos.forEach(element =>{
          this.arr_producto.push({
            titulo: element.titulo,
            precio: element.precio,
            stock: element.stock,
            categoria: element.categoria,
            nventas: element.nventas,
            createdAt: element.createdAt
          });
        })
        console.log(this.arr_producto);
        
        this.productos.reverse();
      },
      (error) => {
        console.error('Error al listar productos:', error);
      }
    );
  }

  filtrar(tipo: string): void {
    const filtroValor = tipo === 'titulo' ? this.filtro_titulo : this.filtro_categoria;
    this.productoService.listar_productos_admin(tipo, filtroValor, this.token).subscribe(
      (response) => {
        this.productos = response.data;
        this.productos.reverse();
      },
      (error) => {
        console.error('Error al listar productos:', error);
      }
    );
  }

  eliminarProducto(id: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
  
    swalWithBootstrapButtons.fire({
      title: '¿Quieres eliminar el producto?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminar_producto_admin(id, this.token).subscribe(
          response => {
            // Realizar acciones adicionales después de eliminar el producto si es necesario
            console.log('Producto eliminado correctamente', response);
            // Mostrar mensaje de éxito
            swalWithBootstrapButtons.fire(
              '¡Eliminado!',
              'El producto ha sido eliminado.',
              'success'
            );
            // Actualizar la lista de productos después de eliminar, si corresponde
            location.reload();
          },
          error => {
            // Manejar errores en caso de que ocurra alguno durante la eliminación
            console.error('Error al eliminar el producto', error);
            // Mostrar mensaje de error
            swalWithBootstrapButtons.fire(
              'Error',
              'Hubo un problema al eliminar el producto.',
              'error'
            );
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'El producto no ha sido eliminado.',
          'info'
        );
      }
    });
  }  

  donwload_excel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Reporte de productos");

    worksheet.addRow(undefined);
    for (let x1 of this.arr_producto){
      let x2=Object.keys(x1);

      let temp=[]
      for(let y of x2){
        temp.push(x1[y])
      }
      worksheet.addRow(temp)
    }

    let fname='REP01- ';

    worksheet.columns = [
      { header: 'Producto', key: 'col1', width: 30},
      { header: 'Stock', key: 'col2', width: 15},
      { header: 'Precio', key: 'col3', width: 15},
      { header: 'Categoria', key: 'col4', width: 25},
      { header: 'N° ventas', key: 'col5', width: 15},
      { header: 'Fecha', key: 'col4', width: 30},
    ]as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');
    });

  }
}
