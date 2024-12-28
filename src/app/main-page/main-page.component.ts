import { Component } from '@angular/core';
import { ListaService } from '../lista.service';
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
  imports: [CommonModule, FormsModule,CreateListComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  listas: lista[] = [];
  email: string = '';

  constructor(private listaService: ListaService, private router: Router,public manager : ManagerService,private cookieService: CookieService) {}

  ngOnInit(): void {
    this.email = this.cookieService.get('userEmail');
    this.cargarListas();
  }

  cargarListas(): void {
    this.listaService.extraerListas(this.email).subscribe({
      next: (data) => {
        this.listas = data;
        console.log('Listas cargadas:', this.listas); // Verifica en la consola
      },
      error: (err) => {
        console.error('Error al cargar las listas:', err);
      },
    });
  }

  // Método para redirigir a la página de detalles de la lista
  verDetalles(indice: number): void {
    this.manager.listaSeleccionada=this.listas[indice];
    this.router.navigate(['/ListDetails']);
  }

}
