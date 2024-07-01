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
import { InventarioProductoComponent } from './pages/productos/inventario-producto/inventario-producto.component';
import { CreateCuponComponent } from './pages/cupones/create-cupon/create-cupon.component';
import { IndexCuponComponent } from './pages/cupones/index-cupon/index-cupon.component';
import { UpdateCuponComponent } from './pages/cupones/update-cupon/update-cupon.component';
import { ConfigComponent } from './pages/config/config.component';
import { VariedadProductoComponent } from './pages/productos/variedad-producto/variedad-producto.component';

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
        { path: 'productos/inventario/:id', component: InventarioProductoComponent, canActivate: [adminGuard] },
        { path: 'productos/variedades/:id', component: VariedadProductoComponent, canActivate: [adminGuard] },

        { path: 'cupones', component: IndexCuponComponent, canActivate: [adminGuard] },
        { path: 'cupones/registro', component: CreateCuponComponent, canActivate: [adminGuard] },
        { path: 'cupones/:id', component: UpdateCuponComponent, canActivate: [adminGuard] },

        { path: 'configuraciones', component: ConfigComponent, canActivate: [adminGuard] },
    ]},
    { path: 'login', component: LoginComponent,  },
];
