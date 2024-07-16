import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router, RouterOutlet } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Global } from '../../environment/global.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  public nombre: string = '';
  public token: string;
  public config_global: any = {};
  public url;
  public id: any;
  public carrito_arr: Array<any> = [];
  public subtotal = 0; 

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
      (error) => {}
    );
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
    if (typeof localStorage !== 'undefined') {
      this.nombre = localStorage.getItem('nombre') || '';
    }
  }

  logout() {
    window.location.reload();
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('id');
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  calcular_carrito(){
    this.carrito_arr.forEach(element => {
      this.subtotal = this.subtotal + parseInt(element.producto.precio);
    })
  }

  eliminar_item(id: any){
    this.clienteService.eliminar_carrito_cliente(id, this.token).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/productos']).then(() => {
          window.location.reload();
        });
      },
      (error) => {}
    )
  }
}

