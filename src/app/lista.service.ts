import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { producto } from './modelo/producto.model';
import { lista } from './modelo/lista.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListaService {

  private apiUrl = 'http://localhost:80/listas';

  constructor(private http: HttpClient) {}

  crearLista(nombre : string) {
    return this.http.post<any>(this.apiUrl+ "/crearLista", nombre);
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
