import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router, RouterOutlet } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { ClienteService } from '../../services/cliente.service';
import { Global } from '../../environment/global.component';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  public nombre: string = '';
  public token: string;
  public config_global: any = {};
  public url;
  public id: any;
  public carrito_arr: Array<any> = [];
  public subtotal = 0;
  public socket: Socket | null = null;

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  constructor(private router: Router, private clienteService: ClienteService) {
    const token = this.clienteService.getToken();
    this.token = token !== null ? token : '';
    this.url = Global.url;
  
    this.clienteService.obtener_config_publico().subscribe(
      (response) => {
        this.config_global = response.data;
      },
      (error) => {
        console.error('Error al obtener la configuración global:', error);
      }
    );
  
    // Verificar y obtener el ID del localStorage
    if (typeof localStorage !== 'undefined') {
      this.id = localStorage.getItem('id');
    }
  
    // Llamar a obtener_carrito_cliente() solo si this.id tiene un valor válido
    if (this.id) {
      this.obtener_carrito_cliente();
    }
  }
  
  obtener_carrito_cliente(): void {
    this.clienteService.obtener_carrito_cliente(this.id, this.token).subscribe(
      (response) => {
        this.carrito_arr = Array.isArray(response.data) ? response.data : [];
        this.calcular_carrito();
      },
      (error) => {
        console.error('Error al obtener el carrito:', error);
      }
    );
  }  

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.socket = io('http://localhost:3000');

      // Escuchar eventos de socket para actualizar el carrito
      this.socket.on('new-carrito', (data: any) => {
        console.log('Carrito actualizado:', data);
        this.carrito_arr = Array.isArray(data) ? data : [];
        this.calcular_carrito();
        this.obtener_carrito_cliente();
      });
      this.socket.on('new-carrito-add', (data: any) => {
        console.log('Nuevo producto agregado:', data);
        this.carrito_arr.push(data); // Agregar el nuevo producto al carrito
        this.calcular_carrito(); // Recalcular subtotal u otras operaciones necesarias
        this.obtener_carrito_cliente();
      });

      if (typeof localStorage !== 'undefined') {
        this.nombre = localStorage.getItem('nombre') || '';
      }
    }
  }
  

  logout() {
    window.location.reload();
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('id');
    this.router.navigate(['/']).then(() => {
    });
  }

  calcular_carrito(): void {
    if (Array.isArray(this.carrito_arr)) {
      this.subtotal = 0; // Reiniciar subtotal
      this.carrito_arr.forEach(element => {
        if (element.producto && element.producto.precio) {
          this.subtotal += parseInt(element.producto.precio, 10);
        }
      });
    } else {
      console.error('carrito_arr no es un array', this.carrito_arr);
    }
  }  

  eliminar_item(id: any): void {
    // Mostrar mensaje de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar este producto del carrito de compras?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma la eliminación
        this.clienteService.eliminar_carrito_cliente(id, this.token).subscribe(
          (response) => {
            console.log('Respuesta de eliminar carrito:', response.data);
            this.socket?.emit('delete-carrito', { data: response.data });
            Swal.fire('Eliminado', 'El producto ha sido eliminado del carrito', 'success');
          },
          (error) => {
            console.error('Error al eliminar producto del carrito:', error);
            Swal.fire('Error', 'Ocurrió un error al eliminar el producto del carrito', 'error');
          }
        );
      }
    });
  }  
}
