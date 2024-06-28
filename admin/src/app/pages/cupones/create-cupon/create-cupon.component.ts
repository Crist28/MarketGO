import { Component } from '@angular/core';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CuponService } from '../../../services/cupon.service';
import { AdminService } from '../../../services/admin.service';

declare let iziToast: any;

@Component({
  selector: 'app-create-cupon',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, FormsModule, RouterLink],
  templateUrl: './create-cupon.component.html',
  styleUrl: './create-cupon.component.css'
})
export class CreateCuponComponent {

  public cupon: any = {}
  token: string = '';
  constructor(private cuponServive: CuponService, private adminService: AdminService, private router: Router){
    this.token = this.adminService.getToken() ?? '';
  }

  registro(registroForm: NgForm){
    if(registroForm.valid){
      console.log(this.cupon);
      this.cuponServive.registro_cupon_admin(this.cupon, this.token).subscribe(
        response => {
          iziToast.success({
            title: 'OK',
            message: 'Se registro correctamente el cupon',
            position: 'topRight',
        });
        this.router.navigate(['/panel/cupones']);
        },
        error => {
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
