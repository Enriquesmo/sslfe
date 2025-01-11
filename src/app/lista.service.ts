import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { producto } from './modelo/producto.model';
import { lista } from './modelo/lista.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ListaService {

  private apiUrl = 'https://localhost:8080';

  constructor(private http: HttpClient, private router: Router) {}

  crearLista(nombre: string, email: string): Observable<lista> {
    console.log('Creando lista:', nombre, email);
    let url = `https://localhost:8080/listas/crearLista?nombre=${encodeURIComponent(nombre)}&email=${encodeURIComponent(email)}`;
    return this.http.post<lista>(url, {},{withCredentials: true})
  }
  


  extraerListas(email: string): Observable<lista[]> {
    const url = `${this.apiUrl}/listas/getListas`;
    return this.http.get<lista[]>(url, {
      params: { email }, 
      withCredentials: true
    });
  }
    
actualizarNombreLista(listaID: string, nuevoNombre: string): Observable<lista> {
  const url = `${this.apiUrl}/listas/cambiarNombre?idLista=${listaID}&nuevoNombre=${nuevoNombre}`;
  return this.http.put<lista>(url, {}, { withCredentials: true });  
}

aceptarInvitacion(idLista: string, email: string): Observable<any> {
  const url = `${this.apiUrl}/listas/accept-invitacion?idLista=${idLista}&email=${email}`;
  return this.http.post<any>(url, {},{ withCredentials: true }); 
}

eliminarMiembro(listaId: string, email: string): Observable<any> {
  const url = `${this.apiUrl}/listas/eliminarMiembro?email=${email}&idLista=${listaId}`;
  return this.http.delete(url,{withCredentials: true});
}

eliminarLista(idLista: string, email: string): Observable<string> {
  console.log(`Eliminando lista con ID: ${idLista} y email: ${email}`);
  const url = `${this.apiUrl}/listas/eliminarLista`;
  
  return this.http.delete<string>(url, {
    params: { idLista, email },
    responseType: 'text' as 'json',
    withCredentials: true
  });
}


 

}
