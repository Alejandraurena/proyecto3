import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITipoVehiculo } from '../tipo-vehiculo.model';
import { TipoVehiculoService } from '../service/tipo-vehiculo.service';
import { TipoVehiculoDeleteDialogComponent } from '../delete/tipo-vehiculo-delete-dialog.component';

@Component({
  selector: 'easyparking-tipo-vehiculo',
  templateUrl: './tipo-vehiculo.component.html',
})
export class TipoVehiculoComponent implements OnInit {
  tipoVehiculos?: ITipoVehiculo[];
  isLoading = false;

  constructor(protected tipoVehiculoService: TipoVehiculoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.tipoVehiculoService.query().subscribe({
      next: (res: HttpResponse<ITipoVehiculo[]>) => {
        this.isLoading = false;
        this.tipoVehiculos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ITipoVehiculo): number {
    return item.id!;
  }

  delete(tipoVehiculo: ITipoVehiculo): void {
    const modalRef = this.modalService.open(TipoVehiculoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tipoVehiculo = tipoVehiculo;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
