import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; 
import { UserService } from '../user.service';
import { RouterModule } from '@angular/router';
import { PayComponent } from '../pay/pay.component';
import { Router } from '@angular/router'; // Importamos el router
import { CookieService } from 'ngx-cookie-service'; 
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,PayComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {

  email?: string;
  pwd1?: string;
  pwd2?: string;
  respuestaOK?: boolean;
  //contraseniascoinciden?: boolean;
  isPremium: boolean = false; // Controla si el usuario ha seleccionado Premium
  //paymentConfirmed: boolean = false; // Controla si el pago fue confirmado
 // correoExiste: boolean = false; // Verifica si el correo ya está registrado

  constructor(private service: UserService,private router: Router,private cookieService: CookieService) {
    this.respuestaOK = false;
    //this.contraseniascoinciden = false;
  }

  registrar() {
    this.respuestaOK = false;
    //this.contraseniascoinciden = false;

    //if (this.pwd1 !== this.pwd2) {
      //alert('Las contraseñas no coinciden');
      //this.contraseniascoinciden = true;
      //return;
    //}

    // Realiza el registro
    this.service.register(this.email!, this.pwd1!, this.pwd2!).subscribe({
      next: (ok) => {
        console.log('Registro exitoso', ok);
        this.respuestaOK = true;
                  // Si no es Premium, redirige a la página principal
                  const cookies = document.cookie.split(";");

                  // Eliminar cada cookie encontrada
                  cookies.forEach(cookie => {
                      const cookieName = cookie.split("=")[0].trim();
                      this.cookieService.delete(cookieName, '/');
                  });
              
                  console.log("Todas las cookies eliminadas");
                this.service.login(this.email!, this.pwd1!).subscribe(
                (data: string) => {  // El servidor devuelve un string (el token)
                  if (data) {
                    console.log("Usuario logeado");
                    if (this.isPremium) {
          
                      this.router.navigate(['/Pagos'], { queryParams: { email: this.email } });
                    } else {
                      this.router.navigate(['/MainPage']);
                    }
                  }
                },
                error => {
                  console.error("Error en login:", error);
                  alert("Hubo un problema al iniciar sesión. Inténtalo de nuevo: " + error.message);
                }
              );
        // Si es Premium, redirige a la página de pagos
      },
      error: (err) => {
        alert(err.error.message); // Muestra el mensaje personalizado
        console.error('Error en el registro:', err);
      }
    });

  }
  //verificarCorreo() {
    //if (!this.email) {
      //this.isPremium = false; // Desactiva el checkbox si no hay correo
      //alert('Por favor, introduce un correo antes de activar el modo premium.');
      //return;
    //}

    // Llama al backend para verificar si el correo ya está registrado
    //this.service.verificarCorreo(this.email).subscribe({
      //next: (existe) => {
        //this.correoExiste = existe; // Establece si el correo existe
        //if (existe) {
          //this.isPremium = false;
          //console.log('El correo ya existe en la base de datos.');
         
          
        //} else {
          //console.log('El correo no existe. Continúa con el proceso.');
        //}
      //},
      //error: (err) => {
        //this.isPremium = false; // Desactiva el checkbox si hay un error
        //console.error('Error al verificar el correo:', err);
        //alert('Hubo un error al verificar el correo.');
       
      //}
    //});
  //}
  
  // Esta función se ejecuta cuando el pago se completa
 // handlePaymentCompletion() {
   // this.paymentConfirmed = true; // Ahora el pago está confirmado
  //}


}
