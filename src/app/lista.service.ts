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
  
  aniadirProducto(idLista: string, producto: producto): Observable<lista> {
    let apiUrlEspecifica= this.apiUrl+"/addProducto";
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'IdLista': idLista  // Se pasa el IdLista en la cabecera
    });

    return this.http.post<any>(apiUrlEspecifica, producto, { headers });
  }

}
