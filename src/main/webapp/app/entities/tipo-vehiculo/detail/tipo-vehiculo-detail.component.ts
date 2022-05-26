import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITipoVehiculo } from '../tipo-vehiculo.model';

@Component({
  selector: 'easyparking-tipo-vehiculo-detail',
  templateUrl: './tipo-vehiculo-detail.component.html',
})
export class TipoVehiculoDetailComponent implements OnInit {
  tipoVehiculo: ITipoVehiculo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tipoVehiculo }) => {
      this.tipoVehiculo = tipoVehiculo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
