import { Component } from '@angular/core';
import { ListaService } from '../lista.service';
import { UserService } from '../user.service';
import { lista } from '../modelo/lista.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
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
    console.log(`Cargando listas para el email: ${this.email}`);
    this.listaService.extraerListas(this.email).subscribe({
      next: (data) => {
        console.log('Datos recibidos del backend:', data);
        
        if (data.length === 0) {
          console.log('No hay listas asociadas para este usuario.');
          this.listas = []; 
        } else {
          this.listas = data;
        }
      },
      error: (err) => {
        console.error('Error al cargar las listas:', err);
        const errorMessage = err.error?.message || 'Error desconocido al cargar las listas.';
        alert(`Hubo un error al cargar las listas: ${errorMessage}`);
      },
    });
  }
  
  

  verDetalles(indice: number): void {
    sessionStorage.setItem('listaSeleccionada', JSON.stringify(this.listas[indice]));
    this.router.navigate(['/ListDetails']);
  }




  eliminarLista(idLista: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta lista?')) {
      console.log(`Intentando eliminar lista con ID: ${idLista} para email: ${this.email}`);
      this.listaService.eliminarLista(idLista, this.email).subscribe({
        next: (response) => {
          console.log('Respuesta del backend al eliminar lista:', response);
          alert(response);
          this.cargarListas(); 
        },
        error: (err) => {
          console.error('Error al eliminar la lista:', err);
          const errorMessage = err.error?.message || 'Error desconocido al eliminar la lista.';
          alert(`Hubo un error al eliminar la lista: ${errorMessage}`);
        }
      });
    }
  }
  
  
}
