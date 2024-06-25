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

@Component({
  selector: 'app-index-cliente',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, CommonModule, FormsModule, NgbPaginationModule, RouterLink, RouterOutlet],
  templateUrl: './index-cliente.component.html',
  styleUrl: './index-cliente.component.css'
})
export class IndexClienteComponent {
  public filtro_nombres: string = '';
  public filtro_correo: string = '';
  clientes: User[] = [];  
  page = 1;
  pageSize= 20;
  public token: string;

  constructor(private clienteService: ClienteService, private adminService: AdminService) {
    this.token = this.adminService.getToken() ?? '';
  }

  ngOnInit(): void {
    this.clienteService.listar_cliente_filtro_admin('nombres','', this.token).subscribe(
      (response) => {
        this.clientes = response.data;
        console.log(this.clientes);
        this.clientes.reverse();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  filtro(tipo: string): void {
    let filtroValor = tipo === 'nombres' ? this.filtro_nombres : this.filtro_correo;
    this.clienteService.listar_cliente_filtro_admin(tipo, filtroValor, this.token).subscribe(
      (response) => {
        this.clientes = response.data;
        this.clientes.reverse();
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
