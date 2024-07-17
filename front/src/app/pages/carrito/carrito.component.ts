import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ClienteService } from '../../services/cliente.service';
import { Global } from '../../environment/global.component';

import Swal from 'sweetalert2';

import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, RouterLink, MatIconModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  public url;
  public token: string;
  public id: any;
  public carrito_arr: Array<any> = [];
  public subtotal = 0; 
  public total_pagar = 0;
  public socket: Socket | null = null;

  constructor(private clienteService: ClienteService){
    const token = this.clienteService.getToken();
    this.token = token !== null ? token : '';
    this.url = Global.url;
    if(typeof localStorage !== 'undefined'){
      this.id = localStorage.getItem('id');
    }
    this.clienteService.obtener_carrito_cliente(this.id, this.token).subscribe(
      (response) => {
        this.carrito_arr = response.data;
        this.calcular_carrito();
      },
      (error) => {}
    )
  }
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.socket = io('http://localhost:3000');

      // Escuchar eventos de socket para actualizar el carrito
      this.socket.on('new-carrito', (data: any) => {
        console.log('Carrito actualizado:', data);
        this.carrito_arr = Array.isArray(data) ? data : [];
        this.calcular_carrito();
      });
    }
  }
  calcular_carrito(){
    this.carrito_arr.forEach(element => {
      this.subtotal = this.subtotal + parseInt(element.producto.precio);
    })
    this.total_pagar = this.subtotal;
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
            this.clienteService.obtener_carrito_cliente(this.id, this.token).subscribe(
              (response) => {
                this.carrito_arr = response.data;
                this.calcular_carrito();
              },
              (error) => {}
            )
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
