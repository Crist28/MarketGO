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
        console.log(this.productos);
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
        console.log(this.productos);
        this.productos.reverse();
      },
      (error) => {
        console.error('Error al listar productos:', error);
      }
    );
  }
}
