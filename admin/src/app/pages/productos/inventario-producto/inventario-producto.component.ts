import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { AdminService } from '../../../services/admin.service';
import { InventarioService } from '../../../services/inventario.service';

declare let iziToast: any;

import Swal from 'sweetalert2';

import { Workbook } from 'exceljs';
import { saveAs  } from 'file-saver';

@Component({
  selector: 'app-inventario-producto',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, FormsModule, RouterLink, CommonModule, NgbPaginationModule],
  templateUrl: './inventario-producto.component.html',
  styleUrl: './inventario-producto.component.css'
})
export class InventarioProductoComponent {

  public producto: any = {};
  public id: any;
  public idUser: any
  token: string = '';
  public inventario: Array<any> = [];
  public arr_inventario: Array<any> = [];
  public inventario2: any = {};
  page = 1;
  pageSize= 5;

  constructor(private route: ActivatedRoute, private productoService: ProductoService, private adminService: AdminService, private inventarioService: InventarioService){
    this.token = this.adminService.getToken() ?? '';
    this.idUser = localStorage.getItem('id');
    console.log(this.idUser);
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
            this.inventarioService.listar_inventario_producto_admin(this.producto._id, this.token).subscribe(
              response => {
                console.log(response);
                this.inventario = response.data;
                this.inventario.forEach(element => {
                  this.arr_inventario.push({
                    admin: element.admin.nombres + ' ' + element.admin.apellidos,
                    cantidad: element.cantidad,
                    proveedor: element.proveedor,
                    createdAt: element.createdAt
                  })
                })
                this.inventario.reverse();
              }, error => {
                console.log(error);
              }
            )
          }
        }, error => {
          console.log(error);
        }
      );
    });
  }

  eliminarInventario(id: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: '¿Quieres eliminar el inventario?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        this.inventarioService.eliminar_inventario_producto_admin(id, token).subscribe(
          response => {
            console.log('Inventario eliminado correctamente', response);
            swalWithBootstrapButtons.fire(
              '¡Eliminado!',
              'El inventario ha sido eliminado.',
              'success'
            );
            this.inventarioService.listar_inventario_producto_admin(this.producto._id, this.token).subscribe(
              response => {
                console.log(response);
                this.inventario = response.data;
                this.inventario.reverse();
              }, error => {
                console.log(error);
              }
            )
          },
          error => {
            console.error('Error al eliminar el inventario', error);
            swalWithBootstrapButtons.fire(
              'Error',
              'Hubo un problema al eliminar el inventario.',
              'error'
            );
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'El inventario no ha sido eliminado.',
          'info'
        );
      }
    });
  }

  registro_inventario(inventarioForm: NgForm){
    if(inventarioForm.valid){
      console.log(this.inventario2);
      let data = {
        producto: this.producto._id,
        cantidad: inventarioForm.value.cantidad,
        admin: this.idUser,
        proveedor: inventarioForm.value.proveedor
      }
      console.log(data);
      this.inventarioService.registro_inventario_producto_admin(data, this.token).subscribe(
        response => {
          iziToast.success({
            title: 'Ok',
            message: 'Se agrego el nuevo stock al producto',
            position: 'topRight',
          });

          this.inventarioService.listar_inventario_producto_admin(this.producto._id, this.token).subscribe(
            response => {
              console.log(response);
              this.inventario = response.data;
              this.inventario.reverse();
            }, error => {
              console.log(error);
            }
          )

        }, error => {
          console.log(error);
        }
      );
    }else{
      iziToast.error({
        title: 'Error',
        message: 'Los datos del formulario no son validos',
        position: 'topRight',
      });
    }
  }

  donwload_excel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Reporte de inventario");

    worksheet.addRow(undefined);
    for (let x1 of this.arr_inventario){
      let x2=Object.keys(x1);

      let temp=[]
      for(let y of x2){
        temp.push(x1[y])
      }
      worksheet.addRow(temp)
    }

    let fname='REP01- ';

    worksheet.columns = [
      { header: 'Trabajador', key: 'col1', width: 30},
      { header: 'Cantidad', key: 'col2', width: 15},
      { header: 'Proveedor', key: 'col3', width: 25},
      { header: 'Fecha', key: 'col4', width: 30},
    ]as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');
    });

  }
}
