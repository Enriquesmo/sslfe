import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importamos CommonModule
import { ListaService } from '../lista.service';
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

  constructor(private http: HttpClient, private lista: ListaService, private cookieService: CookieService) {}

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.nombreLista = '';
  }

  crearLista() {
    const email = this.cookieService.get('userEmail');
    console.log('Creando lista:', this.nombreLista, email);
    if (this.nombreLista.trim() === '') {
      alert('El nombre de la lista no puede estar vacío.');
      return;
    }
    const listaData = { nombre: this.nombreLista };
    this.lista.crearLista(this.nombreLista, email );

  }
}
