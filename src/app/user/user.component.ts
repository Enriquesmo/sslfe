import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { User } from '../modelo/user';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  user: User = {
    email: '',
    vipFecha: 0,
    vip: false,
    pwd: ''
  };  // Objeto para almacenar la información del usuario
  errorMessage: string = '';
    // Correo del usuario
  constructor(private userService: UserService, private router: Router,private cookieService: CookieService) { }
 
  ngOnInit(): void {
    const email = this.cookieService.get('userEmail');  // Cambia este valor según el email del usuario que necesitas
    this.userService.getUserInfo(email).subscribe({
      next: (data) => {
        console.log(data);  // Verifica si los datos del usuario se están recibiendo correctamente
        this.user = data;  // Asigna los datos del usuario al objeto `user`
      },
      error: (error) => {
        this.errorMessage = 'Hubo un problema al cargar la información del usuario.';  // Mensaje de error si ocurre algún fallo
        console.error(error);  // Muestra detalles del error en la consola
      },
    });
  }
  deleteUser(): void {
    const email = this.user.email;  // Obtenemos el email del usuario
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario con el correo ${email}?`)) {
      this.userService.deleteUser(email).subscribe({
        next: (response) => {
          console.log('Usuario eliminado:', response);
          this.cookieService.deleteAll();
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate(['/Login']);
          // Puedes redirigir o mostrar un mensaje de éxito aquí
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          this.errorMessage = 'Hubo un problema al eliminar el usuario.';
        }
      });
    }
  }
}

  

