import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ListDetailsComponent } from './list-details/list-details.component';
import { CreateListComponent } from './create-list/create-list.component';
import { ChatComponent } from './chat/chat.component';
import { InvitacionComponent } from './invitacion/invitacion.component';
import { PayComponent } from './pay/pay.component';
export const routes: Routes = [
    { path: '', redirectTo: 'Login', pathMatch: 'full' }, // Ruta predeterminada que redirige al Login
    { path: 'Login', component: LoginComponent },
    { path: 'Register', component: RegisterComponent },
    { path: 'MainPage', component: MainPageComponent },
    { path: 'ListDetails', component: ListDetailsComponent },
    { path: 'CreateLists', component: CreateListComponent },
    { path: 'Chat', component: ChatComponent },
    { path: 'invitacion/:listaId', component: InvitacionComponent },
    { path: 'Pagos', component: PayComponent }
];