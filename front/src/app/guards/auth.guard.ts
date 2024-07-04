import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';

export const authGuard: CanActivateFn = (route, state) => {
  const clienteService = inject(ClienteService);
  const router = inject(Router);

  if (!clienteService.isAuthenticated()) {
    router.navigate(['login']);
    return false;
  }
  
  return true;
};
