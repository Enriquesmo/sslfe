export class User {
    email: string;       // Correo electrónico del usuario
    pwd: string;         // Contraseña (hasheada en el backend)
    token?: string;      // Token opcional
    creationTime?: number; // Tiempo de creación (opcional)
    ip?: string;         // Dirección IP (opcional)
    cookie?: string;     // Identificador de cookie
    vip: boolean;        // Usuario VIP o no
  
    constructor(
      email: string,
      pwd: string,
      vip: boolean,
      token?: string,
      creationTime?: number,
      ip?: string,
      cookie?: string
    ) {
      this.email = email;
      this.pwd = pwd;
      this.token = token;
      this.creationTime = creationTime;
      this.ip = ip;
      this.cookie = cookie;
      this.vip = vip;
    }
  }
  