import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITarifaPlana } from '../tarifa-plana.model';

@Component({
  selector: 'easyparking-tarifa-plana-detail',
  templateUrl: './tarifa-plana-detail.component.html',
})
export class TarifaPlanaDetailComponent implements OnInit {
  tarifaPlana: ITarifaPlana | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tarifaPlana }) => {
      this.tarifaPlana = tarifaPlana;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
