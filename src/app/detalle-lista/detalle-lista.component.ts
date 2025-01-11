import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { producto } from '../modelo/producto.model';
import { ListaService } from '../lista.service';
import { ProductoService } from '../producto.service';
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
export class DetalleListaComponent implements OnInit {
  nuevoProducto: string = '';
  unidadesPedidas: number = 0;
  unidadesCompradas: number = 0;
  producto: producto = new producto();
  listaId: string = ''; // Guardamos el id de la lista
  productos: string[] = [];

  constructor(
    private listaService: ListaService,
    public manager: ManagerService,
    private route: ActivatedRoute,
    private productoService: ProductoService 
  ) {}

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      this.listaId = params['id'];
      console.log('ID de lista:', this.listaId);

      if (this.listaId) {
        
      }
    });
  }



  aniadirProducto(): void {
    if (!this.manager.listaSeleccionada) {
      console.error('No hay lista seleccionada');
      return;
    }

    console.log('Voy a almacenar producto');
    let productoCreado = this.producto.crearProducto(this.nuevoProducto, this.unidadesPedidas, this.unidadesCompradas);

    this.productoService.aniadirProducto(this.manager.listaSeleccionada.id, this.producto).subscribe(
      (response) => {
        console.log('Producto agregado correctamente:', response);
        // Añadir el producto a la lista de productos
        this.productos.push(this.producto.nombre);
      },
      (error) => {
        console.error('Error al almacenar el producto:', error);
      }
    );
  }
}
