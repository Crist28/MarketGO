//librerias
import { Routes } from '@angular/router';
//Proteccion de rutas
import { adminGuard } from './guards/admin.guard';
//Componentes
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { IndexClienteComponent } from './pages/clientes/index-cliente/index-cliente.component';
import { CreateClienteComponent } from './pages/clientes/create-cliente/create-cliente.component';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: InicioComponent, canActivate: [adminGuard]},
    { path: 'panel', children: [
        { path: 'clientes', component: IndexClienteComponent, canActivate: [adminGuard] },
        { path: 'clientes/registro', component: CreateClienteComponent, canActivate: [adminGuard] }
    ]},
    { path: 'login', component: LoginComponent,  },
];
