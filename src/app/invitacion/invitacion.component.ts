import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ListaService } from '../lista.service';
import { CookieService } from 'ngx-cookie-service';  // Asegúrate de tener el servicio CookieService

@Component({
  selector: 'app-invitacion',
  standalone: true,
  templateUrl: './invitacion.component.html',
  styleUrl: './invitacion.component.css'
})
export class InvitacionComponent implements OnInit {
  listaId: string = '';
 
  userEmail: string = '';
  usuarioLogeado: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private list: ListaService,
    private cookieService: CookieService  
  ) {}

  ngOnInit() {
    this.userEmail = this.cookieService.get('userEmail');  
    if (!this.userEmail) {
      this.usuarioLogeado = false;
      alert('Es necesario iniciar sesión para aceptar la invitación');
      this.router.navigate(['/Login']);  // Redirige al login
    } else {
      this.usuarioLogeado = true;
      console.log('Usuario logueado:', this.userEmail);
      this.listaId = this.route.snapshot.paramMap.get('listaId')!;
      console.log('Lista ID:', this.listaId);
    }
  }

  acceptInvitation(): void {
    if (!this.userEmail) {
      alert('Es necesario estar logueado para aceptar la invitación');
      this.router.navigate(['/Login']);
      return;
    }

    this.list.aceptarInvitacion(this.listaId, this.userEmail).subscribe(
      (response) => {
        if (response) {
          console.log('Lista actualizada:', response);
          sessionStorage.setItem('listaSeleccionada', JSON.stringify(response));
          this.router.navigate(['/ListDetails']);
        }
      },
      (error) => {
        console.error('Error al aceptar la invitación:', error);
        if (error.status === 403) {
          alert(error.error.message);
        } else {
          alert('Hubo un error al aceptar la invitación. Inténtalo nuevamente.');
        }
        this.router.navigate(['/MainPage']);
      }
    );
  }    

}
