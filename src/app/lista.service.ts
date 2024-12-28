import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { producto } from './modelo/producto.model';
import { lista } from './modelo/lista.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListaService {

  private apiUrl = 'https://localhost:8080';

  constructor(private http: HttpClient) {}

  crearLista(nombre: string, email: string) {
    console.log('Creando lista:', nombre, email);
    let url = `https://localhost:8080/listas/crearLista?nombre=${encodeURIComponent(nombre)}&email=${encodeURIComponent(email)}`;
    return this.http.post(url, {}).subscribe({
      next: (response) => {
        alert('Lista creada con éxito');
        console.log(response);
      },
      error: (err) => {
        alert('Error al crear la lista.');
        console.error(err);
      }
    });
  }
  


  extraerListas(email: string): Observable<lista[]> {
    const url = `${this.apiUrl}/listas/getListas`;
    return this.http.get<lista[]>(url, {
      params: { email }, // Envía el parámetro 'email'
    });
  }
    
  actualizarNombreLista(listaID: string, nuevoNombre: string) {
    const url = `${this.apiUrl}/listas/cambiarNombre?idLista=${listaID}&nuevoNombre=${nuevoNombre}`;
    return this.http.put<any>(url,{});
  }



}
