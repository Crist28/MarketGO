//librerias
import { Routes } from '@angular/router';
//Proteccion de rutas
import { adminGuard } from './guards/admin.guard';
//Componentes
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { IndexClienteComponent } from './pages/clientes/index-cliente/index-cliente.component';
import { CreateClienteComponent } from './pages/clientes/create-cliente/create-cliente.component';
import { EditClienteComponent } from './pages/clientes/edit-cliente/edit-cliente.component';
import { IndexProductoComponent } from './pages/productos/index-producto/index-producto.component';
import { CreateProductoComponent } from './pages/productos/create-producto/create-producto.component';
import { UpdateProductoComponent } from './pages/productos/update-producto/update-producto.component';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', component: InicioComponent, canActivate: [adminGuard]},
    { path: 'panel', children: [
        { path: 'clientes', component: IndexClienteComponent, canActivate: [adminGuard] },
        { path: 'clientes/registro', component: CreateClienteComponent, canActivate: [adminGuard] },
        { path: 'clientes/:id', component: EditClienteComponent, canActivate: [adminGuard] },
        
        { path: 'productos', component: IndexProductoComponent, canActivate: [adminGuard] },
        { path: 'productos/registro', component: CreateProductoComponent, canActivate: [adminGuard] },
        { path: 'productos/:id', component: UpdateProductoComponent, canActivate: [adminGuard] },
    ]},
    { path: 'login', component: LoginComponent,  },
];
