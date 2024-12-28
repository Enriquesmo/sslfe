import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ListaService } from '../lista.service';

@Component({
  selector: 'app-invitacion',
  templateUrl: './invitacion.component.html',
})
export class InvitacionComponent implements OnInit {
  listaId: string = '';
  token: string = '';
  userEmail: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private list : ListaService) {}

  ngOnInit() {
    this.listaId = this.route.snapshot.paramMap.get('listaId')!;
    this.token = this.route.snapshot.queryParamMap.get('token')!;
  }

  acceptInvitation() {
    this.list.aceptarInvitacion(this.listaId, this.token, this.userEmail);
  }
}
