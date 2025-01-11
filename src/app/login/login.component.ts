import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors  } from '@angular/forms';
import { on } from 'events';
import { UserService } from '../user.service';
import { Token } from '@angular/compiler';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  alreadyAuthenticated = false;

  constructor(private cookieService: CookieService,private formBuilder: FormBuilder, private user: UserService, private router: Router) { 

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pwd: ['', [Validators.required, Validators.minLength(6), createPasswordStrengthValidator()]]
    });
  
  }

  ngOnInit() {
    this.user.isAuthenticated().subscribe(
      (isAuthenticated: boolean) => {
        if (isAuthenticated) {
          console.log("Sesión activa");
          this.alreadyAuthenticated = isAuthenticated;
        } else {
          console.log("No hay sesión activa");
        }
      },
      error => {
        
      }
    );
  }
  
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      console.warn("Formulario invalido");
    } else {
      console.log("todo OK", JSON.stringify(this.loginForm.value, null, 2));

      this.user.login(this.loginForm.controls['email'].value, this.loginForm.controls['pwd'].value).subscribe({
        next:(response) => { 
          if (response) {
            console.log("Usuario logeado");
            this.router.navigate(['/MainPage']);
          } else {
            console.log("Usuario no logeado");
            alert("Credenciales incorrectas");
          }
        },
        error: (err) => {
          console.error('Error en login:', err);
  
          const errorMessage = err.error;
          alert(`Hubo un error en login: ${errorMessage}`);
        }
    });
    }
  }

  onReset() {
  }

  onContinue() {
    this.router.navigate(['/MainPage']); 
  }

  onGoToLogin() {
    this.alreadyAuthenticated = false; 
    const cookies = document.cookie.split(";");

    cookies.forEach(cookie => {
        const cookieName = cookie.split("=")[0].trim();
        this.cookieService.delete(cookieName, '/');
    });

    console.log("Todas las cookies eliminadas");
  }

  recuperarContrasena(): void {
    const email = prompt('Introduce tu correo electrónico para recuperar la contraseña:');
    if (email) {
      this.user.recuperarContrasena(email).subscribe({
        next: (response: string) => {
          alert(response); 
        },
        error: (err) => {
          console.error(err);
          alert('Hubo un error al recuperar la contraseña.');
        }
      });
    }
  }
  

}


export  function createPasswordStrengthValidator(): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {
      const value = control.value;
      if (!value) {
          return null;
      }
      const hasUpperCase = /[A-Z]+/.test(value);
      const hasLowerCase = /[a-z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;
            return !passwordValid ? {passwordStrength:true}: null;
  }
}




