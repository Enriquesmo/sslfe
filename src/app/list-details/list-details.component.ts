import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { producto } from '../modelo/producto.model';
import { ListaService } from '../lista.service';
import { UserService } from '../user.service';
import { ProductoService } from '../producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { lista } from '../modelo/lista.model';
import { WebSocketSubject } from 'rxjs/webSocket';


@Component({
  selector: 'app-list-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-details.component.html',
  styleUrl: './list-details.component.css'
})
export class ListDetailsComponent implements OnInit {
  nuevoProducto: string = '';
  unidadesPedidas: number = 0;
  unidadesCompradas: number = 0;
  producto: producto = new producto();
  lista: lista = new lista();
  listaID?: string = '';
  listaNombre?: string = '';
  productosLista: producto[] = [];
  mostrarAgregarProducto: boolean = false;
  esCreador: boolean = false;
  editandoNombre: boolean = false; 
  nuevoNombreLista: string = '';
  email: string = '';
  vip: boolean = false; 
  mostrarUrl: boolean = true;
  mostrarModal: boolean = false;
  emailDestino: string = '';
  mostrarBotonCompartir: boolean = true;


  private ws!: WebSocketSubject<any>;
  http: any;
  constructor(
    private productoService: ProductoService,
    private listaService: ListaService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private userService: UserService,
    private router: Router
  ) {
    this.email = this.cookieService.get('userEmail');
  }
  

  ngOnInit(): void {
    const listaGuardada = sessionStorage.getItem('listaSeleccionada');
    if (listaGuardada) {
      this.lista = JSON.parse(listaGuardada);
      this.listaNombre = this.lista.nombre;
      this.listaID = this.lista.id;
      this.productosLista = this.lista.productos || [];
      this.esVip(this.email);
      console.log('Lista cargada desde sessionStorage:', lista);
      
      const userEmail = this.cookieService.get('userEmail');
      if (this.lista.creador === userEmail) {
        this.esCreador = true; 
      } else {
        this.esCreador = false; 
      }
    } else {
      console.error('No se encontró la lista en sessionStorage.');
    }
    this.connectWebSocket();
    if ( this.lista.emailsUsuarios.length >= 2 && !this.vip && this.lista.creador === this.email) {
      this.mostrarUrl = false; 
      this.mostrarBotonCompartir = false;

    }
  }



  connectWebSocket(): void {
    const userEmail = this.cookieService.get('userEmail');
    const listaId = this.listaID;
  
    if (userEmail && listaId) {
      const listaGuardada = sessionStorage.getItem('listaSeleccionada');
      if (!listaGuardada) {
        console.error('No se encontró la lista en sessionStorage');
        return; 
      }
  
      const wsUrl = `wss://localhost:8080/wsListas?email=${encodeURIComponent(userEmail)}&listaId=${listaId}`;
      this.ws = new WebSocketSubject(wsUrl);
      
  
      this.ws.subscribe({
        next: (message) => {
          console.log('Mensaje recibido:', message);
          this.handleWebSocketMessage(message);
  
          this.updateSessionStorageIfNeeded(message);
        },
        error: (err) => {
          console.error('Error en WebSocket:', err);
          alert('Error en la conexión WebSocket.');
        },
        complete: () => console.log('WebSocket cerrado.')
      });
    }
  }
  
  private updateSessionStorageIfNeeded(message: any): void {
    try {
      const parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
      if (parsedMessage.lista && parsedMessage.lista.id === this.listaID) {
        const listaActualizada = parsedMessage.lista;
        console.log('Actualizando sessionStorage con nueva lista:', listaActualizada);
  
        sessionStorage.setItem('listaSeleccionada', JSON.stringify(listaActualizada));
        this.lista = listaActualizada;
        this.listaNombre = listaActualizada.nombre;
        this.productosLista = listaActualizada.productos || [];
      }
    } catch (error) {
      console.error('Error al procesar el mensaje de WebSocket:', error);
    }
  }
  
  handleWebSocketMessage(message: any): void {
    const parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
    console.log("Mensaje WebSocket recibido:", parsedMessage);
    
    if (parsedMessage.lista && parsedMessage.lista.id === this.listaID) {
        this.updateSessionStorageIfNeeded(parsedMessage);
    }


    if (parsedMessage.mensaje) {
      const mensaje = parsedMessage.mensaje.toLowerCase();
    if (mensaje.includes("se ha eliminado de la lista a:")) {
      console.log("eliminado:", mensaje);
      if ( this.lista.emailsUsuarios.length >= 2 && !this.vip && this.lista.creador === this.email) {
        this.mostrarUrl = false;
        this.mostrarBotonCompartir = false;
      } else {
        this.mostrarUrl = true;
        this.mostrarBotonCompartir = true;
      }
      const emailEliminado = mensaje.split(":")[1]?.trim();
      if (emailEliminado && emailEliminado === this.email) {
        console.log("El usuario ha sido eliminado, redirigiendo a MainPage...");
        this.router.navigate(['/MainPage']); 
      }
    } else if (mensaje.includes("nuevo miembro: ")) {
      console.log("nuevo miembro: :", mensaje);
      if ( this.lista.emailsUsuarios.length >= 2 && !this.vip && this.lista.creador === this.email) {
        this.mostrarUrl = false;
        this.mostrarBotonCompartir = false;
      } else {
        this.mostrarUrl = true;
        this.mostrarBotonCompartir = true;
      }
    } else {
      console.log("Otro tipo de mensaje:", mensaje);
    }
    }
}


  ngOnDestroy(): void {
    if (this.ws) {
      this.ws.unsubscribe();
    }
  }
  toggleAgregarProducto() {
    this.mostrarAgregarProducto = !this.mostrarAgregarProducto;
    if (!this.vip && this.productosLista.length >= 10) {
      alert('Solo los usuarios VIP pueden añadir más de 10 productos.');
      return;
    }
  }
  esVip(email: string): void {
    this.userService.esVip(email).subscribe({
      next: (data) => {
        this.vip = data;
        console.log('Es VIP:', this.vip);
        console.log('Es VIP:', this.vip);
        if ( this.lista.emailsUsuarios.length >= 2 && !this.vip && this.lista.creador === this.email) {
          this.mostrarUrl = false;
          this.mostrarBotonCompartir = false;
        } else {
          this.mostrarUrl = true;
          this.mostrarBotonCompartir = true;
        }
      },
      error: (err) => {
        console.error('Error al verificar si es VIP:', err.error?.message);
        alert(err.error?.message || 'Error al verificar si es VIP');
      },
    });
  }
  aniadirProducto() {
    if (!this.vip && this.productosLista.length >= 10) {
      console.log('No se pueden añadir más productos. Solo los usuarios VIP pueden exceder el límite de 10 productos.');
      alert('Has alcanzado el límite de 10 productos. Solo los usuarios VIP pueden añadir más.');
      return;
    }
  
    console.log('Voy a almacenar producto');
    this.producto.crearProducto(this.nuevoProducto, this.unidadesPedidas, this.unidadesCompradas);
  
    this.productoService.aniadirProducto(this.listaID!, this.producto, this.email).subscribe(
      (response) => {
        console.log('Producto agregado correctamente:', response);
  
        this.productosLista = response.productos; 
        console.log('Nueva lista de productos:', this.productosLista);
  
        const listaActualizada = {
          id: this.listaID,
          nombre: this.listaNombre,
          productos: this.productosLista,
          creador: this.lista.creador 
        };
        sessionStorage.setItem('listaSeleccionada', JSON.stringify(listaActualizada));
        console.log('Lista actualizada guardada en sessionStorage:', listaActualizada);
  
        this.mostrarAgregarProducto = false;
  
        this.nuevoProducto = '';
        this.unidadesPedidas = 0;
        this.unidadesCompradas = 0;
      },
      (error) => {
        alert(error.error?.message || 'Error al añadir el producto');
        console.error('Error al almacenar el producto:', error);
      }
    );
  }
  
  
 
 generarEnlaceInvitacion(): string {
  if (!this.listaID) {
    console.error('No se ha encontrado el ID de la lista');
    return '';
  }

  const url = this.router.createUrlTree(['/invitacion', this.listaID]);

  const baseUrl = window.location.origin; 
  const fullUrl = baseUrl + url.toString(); 

  return fullUrl;
}

abrirModal() {
  this.mostrarModal = true;
}

cerrarModal() {
  this.mostrarModal = false;
  this.emailDestino = '';
}

enviarEmail() {
  if (!this.emailDestino) {
    alert('Por favor, introduce un correo válido.');
    return;
  }

  const urlInvitacion = this.generarEnlaceInvitacion();
  const emailData = {
    destinatario: this.emailDestino,
    asunto: 'Invitación a la lista de compras',
    cuerpo: `Haz clic en el siguiente enlace para unirte a la lista: <a href="${urlInvitacion}">${urlInvitacion}</a>`,
  };
  
  interface EmailResponse {
    message: string;
  }
  
  this.userService.enviarCorreoAlUsuario(emailData).subscribe(
    (response: any) => {
      console.log('Respuesta del servidor:', response);
      if (response.message === 'Correo enviado exitosamente') {
        alert('Email enviado correctamente');
      } else {
        alert('Hubo un problema con el envío del correo');
      }
    },
    (error) => {
      console.error('Error al enviar el email:', error);
      if (error.error && error.error.message) {
        alert(error.error.message);  
      } else {
        alert('No se pudo enviar el email');
      }
    }
  );
  
  
  
}



copiarUrl() {
  const input = document.getElementById('urlInvitacion') as HTMLInputElement;
  input.select();  
  document.execCommand('copy');  
  console.log('URL copiada al portapapeles');
}

  eliminarProducto(index: number, producto: producto) {
    console.log(`Eliminando producto: ${producto.nombre} en el índice ${index}`);
    
    this.productoService.eliminarProducto(this.listaID!, producto.id).subscribe(
      (response) => {
        console.log('Producto eliminado correctamente:', response);
        
        this.productosLista = response.productos || [];
        
        const listaActualizada = {
          ...JSON.parse(sessionStorage.getItem('listaSeleccionada')!),
          productos: this.productosLista,
        };
        sessionStorage.setItem('listaSeleccionada', JSON.stringify(listaActualizada));
      },
      (error) => {
        alert(error.error?.message || 'Error al eliminar el producto');
        console.error('Error al eliminar el producto:', error);
      }
    );
  }
  

  cambiarCantidad(index: number, producto: producto, cambio: number): void {
    const nuevaCantidad = producto.unidadesPedidas + cambio;
    const cantidadAntigua = producto.unidadesPedidas;
    if (nuevaCantidad < 0 || nuevaCantidad > 10) {
      return; 
    }

    this.productosLista[index].unidadesPedidas = nuevaCantidad;

    this.productoService.modificarProducto(this.productosLista[index]).subscribe(
      (response) => {
        console.log('Producto actualizado correctamente:', response);
  
        this.productosLista[index] = response;
  
        const listaActualizada = {
          ...JSON.parse(sessionStorage.getItem('listaSeleccionada')!),
          productos: this.productosLista,
        };
        sessionStorage.setItem('listaSeleccionada', JSON.stringify(listaActualizada));
      },
      (error) => {
        alert (error.error?.message || 'Error al actualizar el producto');
        this.productosLista[index].unidadesPedidas = cantidadAntigua; 
        console.error('Error al actualizar el producto:', error);
      }
    );
  }
  
  cambiarCantidadComprado(index: number, producto: producto, cambio: number): void {
    const nuevaCantidad = producto.unidadesCompradas + cambio;
    const cantidadAntigua = producto.unidadesCompradas;
    if (nuevaCantidad < 0 || nuevaCantidad > 10) {
        return; 
    }

    this.productosLista[index].unidadesCompradas = nuevaCantidad;

    this.productoService.modificarProducto(this.productosLista[index]).subscribe(
      (response) => {
        console.log('Producto actualizado correctamente:', response);
  
        this.productosLista[index] = response;
  
        const listaActualizada = {
          ...JSON.parse(sessionStorage.getItem('listaSeleccionada')!),
          productos: this.productosLista,
        };
        sessionStorage.setItem('listaSeleccionada', JSON.stringify(listaActualizada));
      },
      (error) => {
        alert (error.error?.message || 'Error al actualizar el producto');
        this.productosLista[index].unidadesCompradas = cantidadAntigua;
        console.error('Error al actualizar el producto:', error);
      }
    );
}


editarNombreLista(): void {
  this.editandoNombre = true; 
  this.nuevoNombreLista = this.listaNombre ?? ''; 
}

guardarNombreLista(): void {
  this.listaNombre = this.nuevoNombreLista;  
  this.editandoNombre = false;  

  this.listaService.actualizarNombreLista(this.listaID!, this.nuevoNombreLista).subscribe(
    (response) => {
      console.log('Nombre de la lista actualizado correctamente:', response.nombre);

      sessionStorage.setItem('listaSeleccionada', JSON.stringify(response));  

      this.listaNombre = response.nombre;
      this.productosLista = response.productos || [];  
    },
    (error) => {
      alert(error.error?.message || 'Error al actualizar el nombre de la lista');
      this.listaNombre = this.lista.nombre;  
      console.error('Error al actualizar el nombre de la lista:', error);
    }
  );
}
  cancelarEditarNombre(): void {
    this.editandoNombre = false; 
  }

  
  eliminarMiembro(email: string): void {
    if(email!==this.lista.creador){
    if (confirm(`¿Estás seguro de que deseas eliminar a ${email} de la lista?`)) {
      this.listaService.eliminarMiembro(this.listaID!, email).subscribe(
        (response) => {
          console.log(`Miembro ${email} eliminado correctamente`);
          

          const listaActualizada = response;
  
          sessionStorage.setItem('listaSeleccionada', JSON.stringify(listaActualizada));
  
          this.lista = listaActualizada;
          if ( this.lista.emailsUsuarios.length >= 2 && !this.vip && this.lista.creador === this.email) {
            this.mostrarUrl = false;
            this.mostrarBotonCompartir = false;
          } else {
            this.mostrarUrl = true;
            this.mostrarBotonCompartir = true;
          }
        },
        (error) => {
          alert(`error al eliminar al miembro ${email}: ${error.error?.message || 'Error desconocido'}`);
          console.error(`Error al eliminar al miembro ${email}:`, error);
        }
      );
    }
    }else{
      alert('No puedes eliminarte a ti mismo de la lista');
    }
  }
  
  
}
