import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { ListaService } from '../lista.service';
import { UserService } from '../user.service';
import { CookieService } from 'ngx-cookie-service';
import { lista } from '../modelo/lista.model';
@Component({
  selector: 'app-create-list',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.css']
})
export class CreateListComponent {
  mostrarFormulario = false;
  nombreLista = '';
  //vip = false;
  cantidadListas = 0;
  listaNueva?: lista;
  constructor(private http: HttpClient, private lista: ListaService,private userService: UserService, private cookieService: CookieService,private router: Router) {}

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.nombreLista = '';
  }

  crearLista() {
    const email = this.cookieService.get('userEmail');

  
      this.lista.crearLista(this.nombreLista, email).subscribe({
        next: (data) => {
          this.listaNueva = data;
          console.log('Lista creada:', this.listaNueva);
          sessionStorage.setItem('listaSeleccionada', JSON.stringify(this.listaNueva));
          this.router.navigate(['/ListDetails']);
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Error desconocido al crear la lista.';
          alert(errorMessage);
          console.error('Error al crear la lista:', err);
        }
      });
    
  }
  

 
  cantListas(email: string): void {
    this.lista.extraerListas(email).subscribe({
      next: (data) => {
        this.cantidadListas = data.length;
        console.log('Cantidad de listas:', this.cantidadListas);
      },
      error: (err) => {
        alert(err.error?.message || 'Error al verificar la cantidad de listas.');
        console.error('Error al verificar la cantidad de listas:', err);
      },
    });
  }
}
