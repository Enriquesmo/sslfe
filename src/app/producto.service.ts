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

  aniadirProducto(idLista: string, producto: producto,email:string): Observable<lista> {
    let apiUrlEspecifica = `${this.apiUrl}/productos/producto`;  // Asegúrate de que la URL esté bien formada
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'IdLista': idLista,  // Se pasa el IdLista en la cabecera
      'email': email
    });
  
    return this.http.post<any>(apiUrlEspecifica, producto, { headers,withCredentials: true });
  }

  eliminarProducto(idLista: string, idProducto: string): Observable<lista> {
    const apiUrlEspecifica = `${this.apiUrl}/productos/producto?idLista=${idLista}&idProducto=${idProducto}`;
    return this.http.delete<lista>(apiUrlEspecifica,{withCredentials: true});
  }
  
  
  modificarProducto(producto: producto): Observable<producto> {
    return this.http.put<producto>(`${this.apiUrl}/productos/producto`, producto,{withCredentials: true});
  }


}
