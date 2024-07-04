import { Component } from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  public token;
  public data: any = {}
  public clienteId: any; 
  public nombres: string = '';
  public apellidos: string = '';
  public email: string = '';

  constructor(private clienteService: ClienteService) {
    this.token = this.clienteService.getToken() ?? '';
    if(typeof localStorage !== 'undefined'){
      this.clienteId = localStorage.getItem('id') || '';
    }
  }

  ngOnInit(): void {
    if(this.token){
      this.clienteService.obtener_cliente_guest(this.clienteId, this.token).subscribe(
        response => {
          this.data = response.data;
          this.nombres = this.data.nombres;
          this.apellidos = this.data.apellidos;
          this.email = this.data.email;
        },error => {
          console.log(error);
        }
      )
    }
  }

}
