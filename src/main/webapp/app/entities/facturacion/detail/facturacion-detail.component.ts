import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFacturacion } from '../facturacion.model';

@Component({
  selector: 'easyparking-facturacion-detail',
  templateUrl: './facturacion-detail.component.html',
})
export class FacturacionDetailComponent implements OnInit {
  facturacion: IFacturacion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ facturacion }) => {
      this.facturacion = facturacion;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
