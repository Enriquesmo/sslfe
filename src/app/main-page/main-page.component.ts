import { Component } from '@angular/core';
import { ListaService } from '../lista.service';
import { UserService } from '../user.service';
import { lista } from '../modelo/lista.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Importamos el router
import { ManagerService } from '../manager.service';
import { CookieService } from 'ngx-cookie-service';
import { CreateListComponent } from '../create-list/create-list.component';
@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateListComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent {
  listas: lista[] = [];
  email: string = '';
  vip: boolean = false;

  constructor(
    private listaService: ListaService,
    private userService: UserService,
    private router: Router,
    public manager: ManagerService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.email = this.cookieService.get('userEmail');
    this.cargarListas();

  }

  cargarListas(): void {
    this.listaService.extraerListas(this.email).subscribe({
      next: (data) => {
        this.listas = data;
        console.log('Listas cargadas:', this.listas);
      },
      error: (err) => {
        //alert(err.error?.message || 'Error al cargar las listas.');
        console.error('Error al cargar las listas:', err);
      },
    });
  }

  verDetalles(indice: number): void {
    sessionStorage.setItem('listaSeleccionada', JSON.stringify(this.listas[indice]));
    this.router.navigate(['/ListDetails']);
  }




  eliminarLista(idLista: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta lista?')) {
      this.listaService.eliminarLista(idLista, this.email).subscribe({
        next: (response) => {
          //if(response){
            alert(response);
            this.cargarListas(); // Recargar las listas después de eliminar
          //}
  
        },
        error: (err) => {
          console.error('Error al eliminar la lista:', err);
  
          // Extrae el mensaje del error devuelto por el backend
          const errorMessage = err.error?.message || 'Error desconocido al eliminar la lista.';
          alert(`Hubo un error al eliminar la lista: ${errorMessage}`);
        }
      });
    }
  }
  
}
