import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFormaDePago } from '../forma-de-pago.model';

@Component({
  selector: 'easyparking-forma-de-pago-detail',
  templateUrl: './forma-de-pago-detail.component.html',
})
export class FormaDePagoDetailComponent implements OnInit {
  formaDePago: IFormaDePago | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formaDePago }) => {
      this.formaDePago = formaDePago;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
