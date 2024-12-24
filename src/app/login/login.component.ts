import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors  } from '@angular/forms';
import { on } from 'events';
import { UserService } from '../user.service';
import { Token } from '@angular/compiler';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

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
  alreadyAuthenticated = false; // Nueva variable para controlar la vista

  constructor(private formBuilder: FormBuilder, private user: UserService, private router: Router) { 

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
          this.alreadyAuthenticated = isAuthenticated; // Cambiar la vista si ya está autenticado
          // Redirige al usuario al dashboard
        } else {
          console.log("No hay sesión activa");
          // Permite al usuario iniciar sesión
        }
      },
      error => {
        console.error("Error verificando la sesión:", error);
      }
    );
  }
  
  
  onSubmit() {
    this.submitted = true;

    // Validación del formulario
    if (this.loginForm.invalid) {
      console.warn("Formulario invalido");
    } else {
      console.log("todo OK", JSON.stringify(this.loginForm.value, null, 2));

      // Enviar datos al servidor para comprobar credenciales
      this.user.login(this.loginForm.controls['email'].value, this.loginForm.controls['pwd'].value).subscribe(
        (data: string) => {  // El servidor devuelve un string (el token)
          if (data) {
            console.log("Usuario logeado");

            // Almacenar el token en localStorage o sessionStorage
            // localStorage.setItem('cookieEnriqueta', data);  // O sessionStorage.setItem() si prefieres mantenerlo solo durante la sesión

            // Redirigir a la página de inicio o dashboard
            // this.router.navigate(['/dashboard']);  // Asegúrate de tener el router configurado para esto

          } else {
            console.log("Usuario no logeado");
            // Mostrar mensaje de error o alertar al usuario
            alert("Credenciales incorrectas");
          }
        },
        error => {
          console.error("Error en login:", error);
          // Mostrar un mensaje de error genérico si ocurre un problema con la solicitud
          alert("Hubo un problema al iniciar sesión. Inténtalo de nuevo.");
        }
      );
    }
  }

  onReset() {
  
  }

  onContinue() {
    this.router.navigate(['/MainPage']); // Redirigir a la página deseada
  }

  onGoToLogin() {
    this.alreadyAuthenticated = false; // Volver a la vista del formulario de login
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
      /**tambien se podría devolver un objeto de este tipo
       * {
          passwordStrength: {
          hasUpperCase: true,
          hasLowerCase: true,
          hasNumeric: false
          }
        }
       */
  }
}


