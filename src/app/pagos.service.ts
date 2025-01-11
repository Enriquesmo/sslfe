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
 prepararTransaccion(amount: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/pagos/prepararTransaccion`, amount, {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    responseType: 'text',  
    withCredentials: true
  });
}

confirmarPago(paymentMethodId: string, email: string, clientSecret: string): Observable<any> {
  const params = new HttpParams()
    .set('paymentMethodId', paymentMethodId)
    .set('email', email)
    .set('clientSecret', clientSecret);

  return this.http.post(`${this.apiUrl}/pagos/confirmarPago`, null, { params,withCredentials: true });
}
}


