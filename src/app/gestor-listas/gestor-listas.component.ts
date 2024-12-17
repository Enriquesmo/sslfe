import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListaService } from '../lista.service';
import { lista } from '../modelo/lista.model';
import { Router } from '@angular/router';
import { ManagerService } from '../manager.service';


@Component({
  selector: 'app-gestor-listas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestor-listas.component.html',
  styleUrl: './gestor-listas.component.css'
})
export class GestorListasComponent {
  nuevaLista? : string;
  misListas: lista[]=[];
  listaCreada : lista=new lista;
  ws : WebSocket = new WebSocket('ws://localhost:8080/wsListas');
  constructor(private service : ListaService,private router: Router, public manager : ManagerService) { 
    this.ws.onerror = (error) => {
      alert('WebSocket error: ' + error);
    }
    this.ws.onmessage = function(event){
      let data = event.data;
      data = JSON.parse(data);

      if (data.tipo == 'actualizacionDeLista'){
        console.log(data.nombre);
      }

    }

  }

  agregarLista(){
    console.log("Voy a almacenar una lista nueva: " + this.nuevaLista);

    this.service.crearLista(this.nuevaLista!).subscribe(
      (response) => {
        this.listaCreada=response;
        console.log('Lista creada', response);
        this.misListas.push(this.listaCreada);
      },
      (error) => {
        console.error('Error al crear la lista', error);
      }
    );
  }
  agregarProducto(indice: number){
      this.manager.listaSeleccionada=this.misListas[indice];
    this.router.navigate(['/DetalleLista']);
  }
}
