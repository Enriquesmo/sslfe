import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { producto } from '../modelo/producto.model';
import { ListaService } from '../lista.service';
import { ProductoService } from '../producto.service';
import { ManagerService } from '../manager.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-list-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-details.component.html',
  styleUrl: './list-details.component.css'
})
export class ListDetailsComponent {
  nuevoProducto : string='';
  unidadesPedidas : number=0;
  unidadesCompradas: number=0;
  producto : producto = new producto;
  listaID? : string="";
  listaNombre? : string="";
  productosLista: producto[] = [];
  mostrarAgregarProducto: boolean = false;
  esCreador: boolean = false;
  editandoNombre: boolean = false; // Para editar nombre
  nuevoNombreLista: string = '';

  constructor( public manager : ManagerService, private productoService: ProductoService,private listaService: ListaService,private route: ActivatedRoute,private cookieService: CookieService){
  }
  ngOnInit(): void {
    // Obtener el id de la lista desde los queryParams
    this.route.queryParams.subscribe(params => {
      this.listaNombre=this.manager.listaSeleccionada?.nombre;
      this.listaID = this.manager.listaSeleccionada?.id;
      console.log('ID de lista:', this.listaID);

      if (this.listaID) {
        // Cargar la lista correspondiente utilizando el id
       this.productosLista = this.manager.listaSeleccionada!.productos;
               // Verificar si el usuario es el creador de la lista
               const userEmail = this.cookieService.get('userEmail');
               if (this.manager.listaSeleccionada?.creador === userEmail) {
                 this.esCreador = true; // El usuario es el creador, mostrar todas las opciones
               } else {
                 this.esCreador = false; // El usuario no es el creador, solo permitir cambiar la cantidad
               }
       console.log(this.productosLista);
      }
    });
  }
  toggleAgregarProducto() {
    this.mostrarAgregarProducto = !this.mostrarAgregarProducto;
  }
aniadirProducto(){
    console.log('voy a almacenar producto');
    let productoCreado = this.producto.crearProducto(this.nuevoProducto, this.unidadesPedidas, this.unidadesCompradas);    
    console.log('voy a almacenar producto');
    this.productoService.aniadirProducto(this.listaID!,this.producto).subscribe(
      (response) => {
        console.log('producto agregado correctamente:', response);
        // TODO añadir el producto a la lista de productos
        console.log(this.producto.nombre);
        this.productosLista.push(this.producto);
        this.mostrarAgregarProducto = false;
      },
      (error) => {
        console.error('Error al almacenar el producto:', error);
      }
    );;
  }

  eliminarProducto(index: number, producto: producto) {
    console.log(`Eliminando producto: ${producto.nombre} en el índice ${index}`);
    console.log(producto)
    console.log(producto.id)
    this.productoService.eliminarProducto(this.listaID!,producto.id).subscribe(
        response => {
          console.log('Producto eliminado correctamente:', response);
          this.productosLista.splice(index, 1); // Eliminar del array local
        },
        error => {
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
    this.productoService.modificarProducto(this.listaID!, this.productosLista[index]).subscribe(
      (response) => {
        console.log('Producto actualizado correctamente:', response);
      },
      (error) => {
        console.error('Error al actualizar el producto:', error);
      }
    );
  
  }

  editarNombreLista(): void {
    this.editandoNombre = true;  // Permite que el campo de texto sea editable
    this.nuevoNombreLista = this.listaNombre ?? '';  // Inicializar el nuevo nombre con el actual
  }

  guardarNombreLista(): void {
    this.listaNombre = this.nuevoNombreLista;  // Guardar el nuevo nombre
    this.editandoNombre = false;  // Desactivar el modo de edición
    // Aquí deberías hacer una llamada al backend para actualizar el nombre de la lista
    this.listaService.actualizarNombreLista(this.listaID!, this.nuevoNombreLista).subscribe(
      response => {
        console.log('Nombre de la lista actualizado correctamente:', response);
      },
      error => {
        console.error('Error al actualizar el nombre de la lista:', error);
      }
    );
  }

  cancelarEditarNombre(): void {
    this.editandoNombre = false;  // Desactivar el modo de edición sin guardar cambios
  }

}
