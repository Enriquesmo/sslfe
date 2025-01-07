import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PagosService {
  private apiUrl = 'https://localhost:9000';

  constructor(private http: HttpClient) {}
 // Método para preparar la transacción en el backend
 prepararTransaccion(amount: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/pagos/prepararTransaccion`, amount, {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    responseType: 'text',  // Cambiado a "text" porque la respuesta es un string con el paymentIntentId
    withCredentials: true
  }).pipe(
    catchError((error) => {
      console.error("Error en prepararTransaccion:", error);
      return throwError(() => new Error('Error al preparar la transacción.'));
    })
  );
}

confirmarPago(paymentMethodId: string, email: string, clientSecret: string): Observable<any> {
  // Construimos los parámetros para la solicitud
  const params = new HttpParams()
    .set('paymentMethodId', paymentMethodId)
    .set('email', email)
    .set('clientSecret', clientSecret);

  return this.http.post(`${this.apiUrl}/pagos/confirmarPago`, null, { params,withCredentials: true })
    .pipe(
      catchError((error) => {
        console.error('Error al confirmar el pago:', error);
        return throwError(() => new Error('Error al confirmar el pago.'));
      })
    );
}
}


