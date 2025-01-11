import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { UserService } from '../user.service';
import { RouterModule } from '@angular/router';
import { PayComponent } from '../pay/pay.component';
import { Router } from '@angular/router'; 
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
  isPremium: boolean = false; 


  constructor(private service: UserService,private router: Router,private cookieService: CookieService) {
    this.respuestaOK = false;
  }

  registrar() {
    this.respuestaOK = false;
   
    this.service.register(this.email!, this.pwd1!, this.pwd2!).subscribe({
      next: (ok) => {
        console.log('Registro exitoso', ok);
        this.respuestaOK = true;
                  const cookies = document.cookie.split(";");

                  cookies.forEach(cookie => {
                      const cookieName = cookie.split("=")[0].trim();
                      this.cookieService.delete(cookieName, '/');
                  });
              
                  console.log("Todas las cookies eliminadas");
                this.service.login(this.email!, this.pwd1!).subscribe(
                (data: string) => { 
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
      },
      error: (err) => {
        alert(err.error.message); 
        console.error('Error en el registro:', err);
      }
    });

  }
 

}
