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
  editandoNombre: boolean = false; // Para editar nombre
  nuevoNombreLista: string = '';
  email: string = '';
  vip: boolean = false; 
  private ws!: WebSocketSubject<any>;
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
    // Recuperar la lista desde sessionStorage
    const listaGuardada = sessionStorage.getItem('listaSeleccionada');
    if (listaGuardada) {
      this.lista = JSON.parse(listaGuardada);
      this.listaNombre = this.lista.nombre;
      this.listaID = this.lista.id;
      this.productosLista = this.lista.productos || [];
      this.esVip(this.email);
      console.log('Lista cargada desde sessionStorage:', lista);

      // Verificar si el usuario es el creador de la lista
      const userEmail = this.cookieService.get('userEmail');
      if (this.lista.creador === userEmail) {
        this.esCreador = true; // El usuario es el creador
      } else {
        this.esCreador = false; // El usuario no es el creador
      }
    } else {
      console.error('No se encontró la lista en sessionStorage.');
    }
    this.connectWebSocket();
  }
  connectWebSocket(): void {
    const userEmail = this.cookieService.get('userEmail');
    const listaId = this.listaID;
  
    if (userEmail && listaId) {
      // Asegúrate de que sessionStorage esté correctamente cargado antes de conectar el WebSocket
      const listaGuardada = sessionStorage.getItem('listaSeleccionada');
      if (!listaGuardada) {
        console.error('No se encontró la lista en sessionStorage');
        return; // No continuar si la lista no está disponible
      }
  
      const wsUrl = `wss://localhost:8080/wsListas?email=${userEmail}&listaId=${listaId}`;
      this.ws = new WebSocketSubject(wsUrl);
  
      this.ws.subscribe({
        next: (message) => {
          console.log('Mensaje recibido:', message);
          this.handleWebSocketMessage(message);
  
          // Actualizar sessionStorage si el mensaje contiene una nueva lista
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
      // Verificar si el mensaje contiene información de una lista
      const parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
      console.log('Mensaje analizado lololp:', parsedMessage.lista);
      if (parsedMessage.listaId && parsedMessage.lista) {
        const listaActualizada = parsedMessage.lista;
        console.log('Actualizando sessionStorage con nueva lista:', listaActualizada);
  
        // Actualizar el sessionStorage con la lista nueva
        sessionStorage.setItem('listaSeleccionada', JSON.stringify(listaActualizada));
        //window.location.reload();
        this.lista = listaActualizada;
        this.listaNombre = listaActualizada.nombre;
        this.productosLista = listaActualizada.productos || [];
      }
    } catch (error) {
      console.error('Error al procesar el mensaje de WebSocket:', error);
    }
  }
  
  


handleWebSocketMessage(message: string): void {
    // Lógica para manejar el mensaje y actualizar la interfaz de usuario
    console.log("Recibido WebSocket:", message);
    // Aquí podrías actualizar la lista o mostrar una notificación en la interfaz
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
      },
      error: (err) => {
        console.error('Error al verificar si es VIP:', err);
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
  
        // Actualizar la lista local con la nueva lista recibida del backend
        this.productosLista = response.productos; // Asume que el backend devuelve la lista actualizada
        console.log('Nueva lista de productos:', this.productosLista);
  
        // Actualizar el sessionStorage con la nueva lista
        const listaActualizada = {
          id: this.listaID,
          nombre: this.listaNombre,
          productos: this.productosLista,
          creador: this.lista.creador // Si es necesario incluir el creador
        };
        sessionStorage.setItem('listaSeleccionada', JSON.stringify(listaActualizada));
        console.log('Lista actualizada guardada en sessionStorage:', listaActualizada);
  
        // Ocultar el formulario de añadir producto
        this.mostrarAgregarProducto = false;
  
        // Limpiar los campos del formulario
        this.nuevoProducto = '';
        this.unidadesPedidas = 0;
        this.unidadesCompradas = 0;
      },
      (error) => {
        console.error('Error al almacenar el producto:', error);
      }
    );
  }
  
  
 //ORTIZ
 generarEnlaceInvitacion(): string {
  if (!this.listaID) {
    console.error('No se ha encontrado el ID de la lista');
    return '';
  }
  
  // Generar el enlace con el id de la lista y el token como parámetros de consulta
  const url = this.router.createUrlTree(['/invitacion', this.listaID], {

  });

  // Devuelve la URL completa como un string
  return url.toString();
}


  eliminarProducto(index: number, producto: producto) {
    console.log(`Eliminando producto: ${producto.nombre} en el índice ${index}`);
    
    this.productoService.eliminarProducto(this.listaID!, producto.id).subscribe(
      (response) => {
        console.log('Producto eliminado correctamente:', response);
        
        // Actualizar la lista de productos con la nueva lista recibida del backend
        this.productosLista = response.productos || [];
        
        // Actualizar el localStorage con la lista actualizada
        const listaActualizada = {
          ...JSON.parse(sessionStorage.getItem('listaSeleccionada')!),
          productos: this.productosLista,
        };
        sessionStorage.setItem('listaSeleccionada', JSON.stringify(listaActualizada));
      },
      (error) => {
        console.error('Error al eliminar el producto:', error);
      }
    );
  }
  

  cambiarCantidad(index: number, producto: producto, cambio: number): void {
    const nuevaCantidad = producto.unidadesPedidas + cambio;

    if (nuevaCantidad < 0 || nuevaCantidad > 10) {
      return; // Evitar cantidades fuera del rango
    }

    // Actualizar la cantidad localmente
    this.productosLista[index].unidadesPedidas = nuevaCantidad;

    // Llamar al servicio para actualizar la cantidad en el backend
    this.productoService.modificarProducto(this.productosLista[index]).subscribe(
      (response) => {
        console.log('Producto actualizado correctamente:', response);
  
        // Actualizar la lista local
        this.productosLista[index] = response;
  
        // Actualizar el localStorage con la lista modificada
        const listaActualizada = {
          ...JSON.parse(sessionStorage.getItem('listaSeleccionada')!),
          productos: this.productosLista,
        };
        sessionStorage.setItem('listaSeleccionada', JSON.stringify(listaActualizada));
      },
      (error) => {
        console.error('Error al actualizar el producto:', error);
      }
    );
  }

  editarNombreLista(): void {
    this.editandoNombre = true; // Permite que el campo de texto sea editable
    this.nuevoNombreLista = this.listaNombre ?? ''; // Inicializar el nuevo nombre con el actual
  }

// Método para guardar el nuevo nombre y actualizar la lista
guardarNombreLista(): void {
  this.listaNombre = this.nuevoNombreLista;  // Actualizar el nombre localmente
  this.editandoNombre = false;  // Desactivar el modo de edición

  // Llamar al servicio para actualizar el nombre de la lista en el backend
  this.listaService.actualizarNombreLista(this.listaID!, this.nuevoNombreLista).subscribe(
    (response) => {
      console.log('Nombre de la lista actualizado correctamente:', response);

      // Actualizar la lista en sessionStorage o localStorage
      sessionStorage.setItem('listaSeleccionada', JSON.stringify(response));  // Guardar la lista con el nuevo nombre

      // Actualizar la propiedad listaNombre con el nuevo nombre
      this.listaNombre = response.nombre;
      this.productosLista = response.productos || [];  // Actualizar la lista de productos
    },
    (error) => {
      console.error('Error al actualizar el nombre de la lista:', error);
    }
  );
}




  cancelarEditarNombre(): void {
    this.editandoNombre = false; // Desactivar el modo de edición sin guardar cambios
  }
}
