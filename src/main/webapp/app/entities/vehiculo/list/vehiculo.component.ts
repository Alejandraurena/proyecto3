import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVehiculo } from '../vehiculo.model';
import { VehiculoService } from '../service/vehiculo.service';
import { VehiculoDeleteDialogComponent } from '../delete/vehiculo-delete-dialog.component';

@Component({
  selector: 'easyparking-vehiculo',
  templateUrl: './vehiculo.component.html',
})
export class VehiculoComponent implements OnInit {
  vehiculos?: IVehiculo[];
  isLoading = false;

  constructor(protected vehiculoService: VehiculoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.vehiculoService.query().subscribe({
      next: (res: HttpResponse<IVehiculo[]>) => {
        this.isLoading = false;
        this.vehiculos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IVehiculo): number {
    return item.id!;
  }

  delete(vehiculo: IVehiculo): void {
    const modalRef = this.modalService.open(VehiculoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.vehiculo = vehiculo;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
