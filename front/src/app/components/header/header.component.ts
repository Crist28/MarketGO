import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  public nombre: string = '';
  public token: string; 
  constructor(private router: Router, private clienteService: ClienteService){
    const token = this.clienteService.getToken();
    this.token = token !== null ? token : '';
  }
  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.nombre = localStorage.getItem('nombre') || '';
    }
  }

  logout(){
    window.location.reload();
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('id');
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });;
  }
}
