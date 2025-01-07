import { producto } from "./producto.model";

export class lista{
    id:string;
    nombre:string;
    productos:producto[];
    creador:string;
    emailsUsuarios:string[]; 

    constructor(){
        this.id="";
        this.nombre="";
        this.productos=[];
        this.creador="";
        this.emailsUsuarios=[];
    }

}
