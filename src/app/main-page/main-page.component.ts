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
    this.esVip(this.email);
  }

  cargarListas(): void {
    this.listaService.extraerListas(this.email).subscribe({
      next: (data) => {
        this.listas = data;
        console.log('Listas cargadas:', this.listas);
      },
      error: (err) => {
        console.error('Error al cargar las listas:', err);
      },
    });
  }

  verDetalles(indice: number): void {
    sessionStorage.setItem('listaSeleccionada', JSON.stringify(this.listas[indice]));
    this.router.navigate(['/ListDetails']);
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

  puedeCrearLista(): boolean {
    return this.vip || this.listas.length < 2;
  }

  eliminarLista(idLista: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta lista?')) {
      this.listaService.eliminarLista(idLista, this.email).subscribe({
        next: (response) => {
          alert('Lista eliminada correctamente');
          this.cargarListas(); // Recargar las listas después de eliminar
        },
        error: (err) => {
          console.error(err);
          alert('Hubo un error al eliminar la lista');
          console.log('Error al eliminar la lista:', err);
        }
      });
    }
  }
}
