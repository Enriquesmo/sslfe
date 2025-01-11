import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { UserService } from '../user.service';

@Component({
  selector: 'app-register1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register1.component.html',
  styleUrl: './register1.component.css'
})

export class Register1Component {

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
    if (this.pwd1 != this.pwd2) {
      console.error('Las contraseñas no coinciden');
      this.contraseniascoinciden = true;
      return;
    }

    this.service.register(this.email!, this.pwd1!, this.pwd2!).subscribe(
      ok => {
        console.log('Registro exitoso', ok);
        this.respuestaOK = true;
      },
      error => {
        console.error('Error en el registro', error);
      }
    );
  }
  
}
