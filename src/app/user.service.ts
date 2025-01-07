import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:9000';

  constructor(private http: HttpClient) {}

  register(email: string, pwd1: string, pwd2: string): Observable<any> {
    const info = {
        email: email,
        pwd1: pwd1,
        pwd2: pwd2,
        
    };
    const headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl + "/users/registrar1", info, { headers: headers }).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 403) {
                // Retorna un error con el mensaje adecuado
                return throwError(() => new Error('Este correo ya está registrado.'));
            }
            return throwError(() => new Error('Error en el registro.'));
        })
    );
}


  login(email: string, pwd: string): Observable<string> {
    const info = {
      email: email,
      pwd: pwd
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.put<string>(
      `${this.apiUrl}/users/login1`,
      info,
      {
        headers: headers,
        responseType: 'text' as 'json',
        withCredentials: true // Habilitar envío y recepción de cookies
      }
    );
  }

  verificarCorreo(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/users/verificar-correo?email=${email}`);
  }
  esVip(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/users/verificar-vip?email=${email}`,{withCredentials: true});
  }
  isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/tokens/validate-session`, {
      withCredentials: true // Asegura que la cookie se envíe con la solicitud
    });
  }
  getUserInfo(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/info`, { params: { email },withCredentials: true }); // Pasa el email como parámetro en la solicitud
  }
  
  deleteUser(email: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/delete2?email=${email},`,{withCredentials: true});
  }
  
  
}
