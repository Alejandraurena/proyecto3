import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITipoVehiculo } from '../tipo-vehiculo.model';
import { TipoVehiculoService } from '../service/tipo-vehiculo.service';

@Component({
  templateUrl: './tipo-vehiculo-delete-dialog.component.html',
})
export class TipoVehiculoDeleteDialogComponent {
  tipoVehiculo?: ITipoVehiculo;

  constructor(protected tipoVehiculoService: TipoVehiculoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tipoVehiculoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
