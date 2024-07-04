import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NgForm, FormsModule } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
// import iziToast from 'izitoast';


declare const jQuery: any;
declare const $: any;
declare let iziToast: any;

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SidebarComponent, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent {
  public cliente: any = {};
  public clienteId: string | undefined;
  token: any;

  constructor(private clienteService: ClienteService) {
    this.token = this.clienteService.getToken() ?? '';

    if (typeof localStorage !== 'undefined') {
      this.clienteId = localStorage.getItem('id') || '';
      this.token = localStorage.getItem('token') || '';
    }
  }

  ngOnInit(): void {
    if (this.clienteId && this.token) {
      this.clienteService.obtener_cliente_guest(this.clienteId, this.token).subscribe(
        response => {
          console.log('Response:', response);
          this.cliente = response.data;
        },
        error => {
          console.error('Error:', error);
          iziToast.error({
            title: 'Error',
            message: 'No se pudo obtener la información del cliente. Por favor, inténtelo de nuevo.',
            position: 'topRight',
          });
        }
      );
    }
  }

  actualizar(actualizarForm: NgForm) {
    // this.cliente.password = $('#input_password').val();
    if(actualizarForm.valid){
      this.clienteService.actualizar_perfil_cliente_guest(this.clienteId, this.cliente, this.token).subscribe(
        response => {
          iziToast.success({
            title: 'Ok',
            message: 'Se actualizo correctamente el usuario',
            position: 'topRight',
          });
        },
        error => {
          console.log(error);
        }
      )
      
    }else{
      iziToast.error({
        title: 'Error',
        message: 'Los datos del fomulario deben ser validos',
        position: 'topRight',
      });
    }
  }
}
