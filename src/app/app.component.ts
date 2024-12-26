import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import { Register1Component } from "./register1/register1.component";
//import { Login1Component } from "./login1/login1.component";
//import { GestorListasComponent } from './gestor-listas/gestor-listas.component';
//import { DetalleListaComponent } from './detalle-lista/detalle-lista.component';
//import { GeolocalizacionComponent } from './geolocalizacion/geolocalizacion.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ListDetailsComponent } from './list-details/list-details.component';
import { CreateListComponent } from './create-list/create-list.component';
import { ChatComponent } from './chat/chat.component';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-root',
  standalone: true,
  //imports: [RouterOutlet, Register1Component, Login1Component, GestorListasComponent, DetalleListaComponent, GeolocalizacionComponent],
  imports: [RouterOutlet, LoginComponent, RegisterComponent, MainPageComponent, ListDetailsComponent, CreateListComponent, ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [CookieService]
})
export class AppComponent {
  title = 'sslfe';
}
