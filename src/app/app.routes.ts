import { Routes } from '@angular/router';
//import { Login1Component } from './login1/login1.component';
//import { Register1Component } from './register1/register1.component';
//import { GestorListasComponent } from './gestor-listas/gestor-listas.component';
//import { DetalleListaComponent } from './detalle-lista/detalle-lista.component';
//import { GeolocalizacionComponent } from './geolocalizacion/geolocalizacion.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ListDetailsComponent } from './list-details/list-details.component';
import { CreateListComponent } from './create-list/create-list.component';
import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
    { path: '', redirectTo: 'Login', pathMatch: 'full' }, // Ruta predeterminada que redirige al Login
    { path: 'Login', component: LoginComponent },
    { path: 'Register', component: RegisterComponent },
    { path: 'MainPage', component: MainPageComponent },
    { path: 'ListDetails', component: ListDetailsComponent },
    { path: 'CreateLists', component: CreateListComponent },
    { path: 'Chat', component: ChatComponent }
    //{ path: 'Login', component: Login1Component },
    //{ path: 'Register', component: Register1Component },
    //{ path: 'GestorListas', component: GestorListasComponent },
    //{ path: 'DetalleLista', component: DetalleListaComponent },
    //{ path: 'Geolocalizacion', component: GeolocalizacionComponent }
];
