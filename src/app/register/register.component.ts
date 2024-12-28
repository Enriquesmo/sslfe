import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; 
import { UserService } from '../user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {

  email? : string
  pwd1? : string
  pwd2? : string
  respuestaOK? : boolean
  contraseniascoinciden? : boolean

  constructor(private service : UserService) { 
    this.respuestaOK = false;
    this.contraseniascoinciden = false;
  }

  registrar() {
    this.respuestaOK = false;
    this.contraseniascoinciden = false;

    if (this.pwd1 !== this.pwd2) {
        console.error('Las contraseñas no coinciden');
        this.contraseniascoinciden = true;
        return;
    }

    this.service.register(this.email!, this.pwd1!, this.pwd2!).subscribe({
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

}
