import { Component } from '@angular/core';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../components/header/header.component';

import { NgForm, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CuponService } from '../../../services/cupon.service';
import { AdminService } from '../../../services/admin.service';

declare let iziToast: any;

@Component({
  selector: 'app-update-cupon',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, FormsModule, RouterLink],
  templateUrl: './update-cupon.component.html',
  styleUrl: './update-cupon.component.css'
})
export class UpdateCuponComponent {
  public cupon: any = {}
  public id: any;
  token: string = '';
  constructor(private route: ActivatedRoute, private cuponServive: CuponService, private adminService: AdminService, private router: Router){
    this.token = this.adminService.getToken() ?? '';
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      console.log(this.id);
      this.cuponServive.obtener_cupon_admin(this.id, this.token).subscribe(
        (response) => {
          console.log(response);    
          this.cupon = response.data;
        },
        (error) => {
          console.log(error);
        }
      )
    });
  }

  actualizar(actualizarForm: NgForm){
    if(actualizarForm.valid){
      this.cuponServive.actualizar_cupon_admin(this.id, this.cupon, this.token).subscribe(
        (response) => {
          iziToast.success({
            title: 'OK',
            message: 'Se actualizo correctamente el cupon',
            position: 'topRight',
        });
        this.router.navigate(['/panel/cupones']);
        },
        (error) => {
          console.log(error);
        }
      )
      
    }else{
      iziToast.error({
        title: 'Error',
        message: 'Los datos del formulario no son válidos',
        position: 'topRight',
      });
    }
  }
}
