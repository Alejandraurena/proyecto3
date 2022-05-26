import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRegistro } from '../registro.model';

@Component({
  selector: 'easyparking-registro-detail',
  templateUrl: './registro-detail.component.html',
})
export class RegistroDetailComponent implements OnInit {
  registro: IRegistro | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ registro }) => {
      this.registro = registro;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
