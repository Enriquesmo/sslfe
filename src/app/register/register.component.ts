import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; 
import { UserService } from '../user.service';
import { RouterModule } from '@angular/router';
import { PayComponent } from '../pay/pay.component';
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
  contraseniascoinciden?: boolean;
  isPremium: boolean = false; // Controla si el usuario ha seleccionado Premium
  paymentConfirmed: boolean = false; // Controla si el pago fue confirmado
  correoExiste: boolean = false; // Verifica si el correo ya está registrado

  constructor(private service: UserService) {
    this.respuestaOK = false;
    this.contraseniascoinciden = false;
  }

  registrar() {
    this.respuestaOK = false;
    this.contraseniascoinciden = false;

    if (this.pwd1 !== this.pwd2) {
      alert('Las contraseñas no coinciden');
      this.contraseniascoinciden = true;
      return;
    }

    if (!this.paymentConfirmed && this.isPremium) {
      alert('El pago debe ser completado antes de registrarse');
      return; // No permite registrar hasta que el pago se complete
    }

    this.service.register(this.email!, this.pwd1!, this.pwd2!,this.isPremium).subscribe({
      next: (ok) => {
        console.log('Registro exitoso', ok);
        this.respuestaOK = true;
      },
      error: (err) => {
        alert(err.message); // Muestra el mensaje personalizado
        console.error('Error en el registro:', err);
      }
    });
  }
  verificarCorreo() {
    if (!this.email) {
      this.isPremium = false; // Desactiva el checkbox si no hay correo
      alert('Por favor, introduce un correo antes de activar el checkbox.');
      return;
    }

    // Llama al backend para verificar si el correo ya está registrado
    this.service.verificarCorreo(this.email).subscribe({
      next: (existe) => {
        this.correoExiste = existe; // Establece si el correo existe
        if (existe) {
          this.isPremium = false;
          console.log('El correo ya existe en la base de datos.');
         
          
        } else {
          console.log('El correo no existe. Continúa con el proceso.');
        }
      },
      error: (err) => {
        this.isPremium = false; // Desactiva el checkbox si hay un error
        console.error('Error al verificar el correo:', err);
        alert('Hubo un error al verificar el correo.');
       
      }
    });
  }
  
  // Esta función se ejecuta cuando el pago se completa
  handlePaymentCompletion() {
    this.paymentConfirmed = true; // Ahora el pago está confirmado
  }


}
