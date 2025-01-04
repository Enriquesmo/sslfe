import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importamos CommonModule
import { ListaService } from '../lista.service';
import { UserService } from '../user.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-create-list',
  standalone: true,
  imports: [FormsModule, CommonModule], // Agregamos CommonModule aquí
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.css']
})
export class CreateListComponent {
  mostrarFormulario = false;
  nombreLista = '';
  vip = false;
  cantidadListas = 0;
  constructor(private http: HttpClient, private lista: ListaService,private userService: UserService, private cookieService: CookieService) {}

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.nombreLista = '';
  }

  crearLista() {
    const email = this.cookieService.get('userEmail');
    if (this.vip || this.cantidadListas < 2 ) {
    console.log('Creando lista:', this.nombreLista, email);
    if (this.nombreLista.trim() === '') {
      alert('El nombre de la lista no puede estar vacío.');
      return;
    }
    const listaData = { nombre: this.nombreLista };
    this.lista.crearLista(this.nombreLista, email );
  }
  alert('No puedes crear más listas');
  }
  esVip(email: string): void {
    this.userService.esVip(email).subscribe({
      next: (data) => {
        this.vip = data;
        console.log('Es VIP:', this.vip);
      },
      error: (err) => {
        console.error('Error al verificar si es VIP:', err);
      },
    });
  }
  cantListas(email: string): void {
    this.lista.extraerListas(email).subscribe({
      next: (data) => {
        this.cantidadListas = data.length;
        console.log('Cantidad de listas:', this.cantidadListas);
      },
      error: (err) => {
        console.error('Error al verificar la cantidad de listas:', err);
      },
    });
  }
}
