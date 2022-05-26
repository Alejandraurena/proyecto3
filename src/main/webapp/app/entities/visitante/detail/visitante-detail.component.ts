import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVisitante } from '../visitante.model';

@Component({
  selector: 'easyparking-visitante-detail',
  templateUrl: './visitante-detail.component.html',
})
export class VisitanteDetailComponent implements OnInit {
  visitante: IVisitante | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ visitante }) => {
      this.visitante = visitante;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
