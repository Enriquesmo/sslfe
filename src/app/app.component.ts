import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ListDetailsComponent } from './list-details/list-details.component';
import { CreateListComponent } from './create-list/create-list.component';
import { ChatComponent } from './chat/chat.component';
import { CookieService } from 'ngx-cookie-service';
import { PayComponent } from './pay/pay.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, RegisterComponent, MainPageComponent, ListDetailsComponent, CreateListComponent, ChatComponent,PayComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [CookieService]
})
export class AppComponent {
  title = 'Tus listas de la compra';

  constructor() {
  }
}