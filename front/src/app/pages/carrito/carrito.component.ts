import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ClienteService } from '../../services/cliente.service';
import { Global } from '../../environment/global.component';

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
  }
  calcular_carrito(){
    this.carrito_arr.forEach(element => {
      this.subtotal = this.subtotal + parseInt(element.producto.precio);
    })
    this.total_pagar = this.subtotal;
  }
}
