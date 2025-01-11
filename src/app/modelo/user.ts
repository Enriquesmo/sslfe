export class User {
    email: string;       
    pwd: string;         
    token?: string;     
    creationTime?: number; 
    ip?: string;       
    cookie?: string;   
    vip: boolean;       
    vipFecha?: number; 
    constructor(
      email: string,
      pwd: string,
      vip: boolean,
      token?: string,
      creationTime?: number,
      ip?: string,
      cookie?: string,
      vipFecha?: number
      
    ) {
      this.email = email;
      this.pwd = pwd;
      this.token = token;
      this.creationTime = creationTime;
      this.ip = ip;
      this.cookie = cookie;
      this.vip = vip;
      this.vipFecha = vipFecha;
    }
  }
  