import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://alarcosj.esi.uclm.es/fakeAccountsBE';

  constructor(private http: HttpClient) {}

  register1(email : string, pwd1 : string, pwd2 : string) {
    let info = {
      email : email,
      pwd1 : pwd1, 
      pwd2 : pwd2
    }
    return this.http.post<any>(this.apiUrl+"/users/registrar1", info);
  }

  login1(email : string, pwd : string) {
    let info = {
      email : email,
      pwd1 : pwd
    }
    return this.http.put<any>(this.apiUrl+"/users/login1", info);
  }
}

