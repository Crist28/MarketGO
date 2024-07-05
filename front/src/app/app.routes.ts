import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { PerfilComponent } from './pages/usuario/perfil/perfil.component';

import { authGuard } from './guards/auth.guard';
import { IndexProductoComponent } from './pages/productos/index-producto/index-producto.component';

export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cuenta/perfil', component: PerfilComponent, canActivate: [authGuard] },

    { path: 'productos', component: IndexProductoComponent },
    { path: 'productos:categoria/:categoria', component: IndexProductoComponent },
];
