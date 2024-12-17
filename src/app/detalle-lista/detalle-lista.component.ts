import { Component } from '@angular/core';
import { producto } from '../modelo/producto.model';
import { ListaService } from '../lista.service';
import { ManagerService } from '../manager.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-lista.component.html',
  styleUrl: './detalle-lista.component.css'
})
export class DetalleListaComponent {
  nuevoProducto : string='';
  unidadesPedidas : number=0;
  unidadesCompradas: number=0;
  producto : producto = new producto;
  lista? : string="";
  // TODO: Cambiar any por el tipo correcto y mostrar los productos
  productos: string[] = [];
  

  constructor(private listaService: ListaService, public manager : ManagerService){
    this.lista=this.manager.listaSeleccionada?.nombre;
  }

  aniadirProducto(){
    console.log('voy a almacenar producto');
    let productoCreado = this.producto.crearProducto(this.nuevoProducto, this.unidadesPedidas, this.unidadesCompradas);    this.listaService.aniadirProducto(this.manager.listaSeleccionada!.id,this.producto).subscribe(
      (response) => {
        console.log('producto agregado correctamente:', response);
        // TODO añadir el producto a la lista de productos
        console.log(this.producto.nombre);
        this.productos.push(this.producto.nombre);
      },
      (error) => {
        console.error('Error al almacenar el producto:', error);
      }
    );;
  }
}
