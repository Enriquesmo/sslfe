import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { producto } from './modelo/producto.model';
import { lista } from './modelo/lista.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'https://localhost:8080';
  constructor(private http: HttpClient) { }

  aniadirProducto(idLista: string, producto: producto): Observable<lista> {
    let apiUrlEspecifica = `${this.apiUrl}/productos/producto`;  // Asegúrate de que la URL esté bien formada
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'IdLista': idLista  // Se pasa el IdLista en la cabecera
    });
  
    return this.http.post<any>(apiUrlEspecifica, producto, { headers });
  }

  eliminarProducto(idLista: string, idProducto: string): Observable<producto> {
    const apiUrlEspecifica = `${this.apiUrl}/productos/producto?idLista=${idLista}&idProducto=${idProducto}`;
  
    return this.http.delete<any>(apiUrlEspecifica);
  }
  
  modificarProducto( producto: producto): Observable<lista> {
    return this.http.put<any>(`${this.apiUrl}/productos/producto`, producto);
  }


}
