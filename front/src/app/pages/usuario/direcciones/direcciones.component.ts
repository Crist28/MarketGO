import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { GuestService } from '../../../services/guest.service';

declare const $: any;
declare let iziToast: any;

@Component({
  selector: 'app-direcciones',
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    RouterLink,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './direcciones.component.html',
  styleUrl: './direcciones.component.css',
})
export class DireccionesComponent {
  public token: string;
  public direccion: any = {
    pais: '',
    region: '',
    provincia: '',
    distrito: '',
    principal: false,
  };

  public direcciones: Array<any> = [];

  public regiones: Array<any> = [];
  public provincias: Array<any> = [];
  public distritos: Array<any> = [];

  public regiones_arr: Array<any> = [];
  public provincias_arr: Array<any> = [];
  public distritos_arr: Array<any> = [];

  constructor(
    private clienteService: ClienteService,
    private guestService: GuestService
  ) {
    const token = this.clienteService.getToken();
    this.token = token !== null ? token : '';

    this.guestService.get_Regiones().subscribe(
      (response) => {
        this.regiones_arr = response
      },
      (error) => {}
    );
    this.guestService.get_Provincias().subscribe(
      (response) => {
        this.provincias_arr = response
      },
      (error) => {}
    );
    this.guestService.get_Distritos().subscribe(
      (response) => {
        this.distritos_arr = response
      },
      (error) => {}
    );

  }

  ngOnInit(): void {
    this.obtener_direccion();
  }

  select_pais() {
    if (this.direccion.pais === 'Colombia') {
      $('#sl-region').prop('disabled', false);
      this.guestService.get_Regiones().subscribe(
        (response) => {
          response.forEach((element: any) => {
            this.regiones.push({
              id: element.id,
              name: element.name,
            });
          });
        },
        (error) => {}
      );
    } else {
      $('#sl-region').prop('disabled', true);
      $('#sl-provincia').prop('disabled', true);
      $('#sl-distrito').prop('disabled', true);

      this.regiones = [];
      this.provincias = [];
      this.distritos = [];

      this.direccion.region = '';
      this.direccion.provincia = '';
      this.direccion.distrito = '';
    }
  }

  select_region() {
    this.provincias = [];
    $('#sl-provincia').prop('disabled', false);
    $('#sl-distrito').prop('disabled', true);
    this.direccion.provincia = '';
    this.direccion.distrito = '';
    this.guestService.get_Provincias().subscribe(
      (response) => {
        response.forEach((element: any) => {
          if (element.department_id == this.direccion.region) {
            this.provincias.push(element);
          }
        });
      },
      (error) => {}
    );
  }

  select_provincia() {
    this.distritos = [];
    $('#sl-distrito').prop('disabled', false);
    this.direccion.distrito = '';
    this.guestService.get_Distritos().subscribe((response) => {
  
      response.forEach((element: any) => {
        if(element.province_id === this.direccion.provincia){
          this.distritos.push(element);
        }
        
      });
    });
  }

  registrar(registroForm: NgForm){
    if(registroForm.valid){

      this.regiones_arr.forEach(element => {
        if(parseInt(element.id) == parseInt(this.direccion.region)){
          this.direccion.region = element.name
        }
      });

      this.provincias_arr.forEach(element => {
        if(parseInt(element.id) == parseInt(this.direccion.provincia)){
          this.direccion.provincia = element.name
        }
      });

      this.distritos_arr.forEach(element => {
        if(parseInt(element.id) == parseInt(this.direccion.distrito)){
          this.direccion.distrito = element.name
        }
      });

      let data = {
        destinatario: this.direccion.destinatario,
        dni: this.direccion.dni,
        zip: this.direccion.zip,
        direccion: this.direccion.direccion,
        telefono: this.direccion.telefono,
        pais: this.direccion.pais,
        region: this.direccion.region,
        provincia: this.direccion.provincia,
        distrito: this.direccion.distrito,
        principal: this.direccion.principal,
        cliente: localStorage.getItem('id')
      }

      this.clienteService.registro_direccion_cliente(data, this.token).subscribe((response) => {
        this.direccion = {
          pais: '',
          region: '',
          provincia: '',
          distrito: '',
          principal: false,
        };
        $('#sl-region').prop('disabled', true);
        $('#sl-provincia').prop('disabled', true);
        $('#sl-distrito').prop('disabled', true);
        iziToast.success({
          title: 'Ok',
          message: 'Se agrego la direccion correctamente',
          position: 'topRight',
        });
      },
      (error) => {

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

  obtener_direccion(){
    this.clienteService.obtener_direccion_todos_cliente(localStorage.getItem('id'), this.token).subscribe(
      (response) =>{
        this.direcciones = response.data;
        
      },
      error=>{

      }
    )
  }

  establecer_principal(id:any){
    this.clienteService.cambiar_direccion_principal_cliente(id, localStorage.getItem('id'), this.token).subscribe(
      (response) =>{
        iziToast.success({
          title: 'Ok',
          message: 'Se actualizo la direccion principal',
          position: 'topRight',
        });
        this.obtener_direccion();
      },
      error=>{

      }
    )
  }
  
}
