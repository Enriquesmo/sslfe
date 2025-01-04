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
    private http: HttpClient,
    private router: Router,
    private list: ListaService,
    private cookieService: CookieService  // Inyecta el servicio para verificar la sesión
  ) {}

  ngOnInit() {
    // Obtener el id de la lista desde la URL
   


    // Verificar si el usuario está logueado
    this.userEmail = this.cookieService.get('userEmail');  // Obtener el email desde las cookies (o tu método de autenticación)
    if (!this.userEmail) {
      this.usuarioLogeado = false;
      // Redirigir al login si no está logueado
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
    // Comprobar si el usuario está logueado
    if (!this.userEmail) {
      alert('Es necesario estar logueado para aceptar la invitación');
      // Redirigir al login
      this.router.navigate(['/Login']);
      return;
    }

    // Si está logueado, llamar al servicio para aceptar la invitación
    this.list.aceptarInvitacion(this.listaId, this.userEmail).subscribe(
      (response) => {
        alert('Invitación aceptada correctamente');
        console.log('Lista actualizada:', response);
        // Redirigir a la página de detalles de la lista
        sessionStorage.setItem('listaSeleccionada', JSON.stringify(response));
        this.router.navigate(['/ListDetails']);
      },
      (error) => {
        console.error('Error al aceptar la invitación:', error);
        alert('Hubo un error al aceptar la invitación. Inténtalo nuevamente.');
      }
    );
  }
  //acceptInvitation() {
    //if (this.usuarioLogeado) {
      // Si está logueado, llamar al método para aceptar la invitación
      //this.list.aceptarInvitacion(this.listaId, this.userEmail);
      //alert('Invitación aceptada');
      //this.router.navigate(['/MainPage']);  // Redirigir a la página principal después de aceptar la invitación
    //} else {
      //alert('Por favor, inicia sesión primero');
      //this.router.navigate(['/Login']);  // Redirigir al login si no está logueado
    //}
  //}
}
