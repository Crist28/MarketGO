import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,RouterOutlet,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  public nombre: string = '';
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.nombre = localStorage.getItem('nombre') || '';
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  showAlert() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: '¿Quieres cerrar la sesión?',
      text: "Podrás volver a iniciar sesión más tarde.!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          '¡Sesión cerrada!',
          'Has cerrado sesión exitosamente.',
          'success'

        ).then(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          localStorage.removeItem('nombre');
          setTimeout(() => {
            this.router.navigate(['/']).then(() => {
              window.location.reload();
            });
          }, 1500);
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Tu sesión sigue activa. :)',
          'error'
        );
      }
    });
  }
}
