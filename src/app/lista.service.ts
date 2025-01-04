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
    
// Método para actualizar el nombre de la lista en el backend y recibir la lista actualizada
actualizarNombreLista(listaID: string, nuevoNombre: string): Observable<lista> {
  const url = `${this.apiUrl}/listas/cambiarNombre?idLista=${listaID}&nuevoNombre=${nuevoNombre}`;
  return this.http.put<lista>(url, {});  // Recibimos la lista completa con el nuevo nombre
}

aceptarInvitacion(idLista: string, email: string): Observable<lista> {
  const url = `${this.apiUrl}/listas/accept-invitacion?idLista=${idLista}&email=${email}`;
  return this.http.post<lista>(url, {});  // Asegúrate de enviar la solicitud POST con parámetros en la URL
}

//obtenerProductosDeLista(idLista: string): Observable<producto[]> {
  //const url = `${this.apiUrl}/producto?idLista=${idLista}`;  // La URL corresponde al endpoint que creamos en el backend
  //return this.http.get<producto[]>(url);  // Realizamos una solicitud GET
//}

//aceptarInvitacion(listaId: string, userEmail: string): void {
  //console.log('Aceptando invitación:', listaId, userEmail);
  //this.http.post(this.apiUrl+"/accept-invitacion", { listaId: listaId, emailUsuario: userEmail })
    //.subscribe(() => {
      //alert('Invitación aceptada');
      //this.router.navigate(['/MainPage', listaId]);
    //}, error => {
      //console.error('Error al aceptar la invitación', error);
    //});
  //}

}
