import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFacturacion } from '../facturacion.model';
import { FacturacionService } from '../service/facturacion.service';

@Component({
  templateUrl: './facturacion-delete-dialog.component.html',
})
export class FacturacionDeleteDialogComponent {
  facturacion?: IFacturacion;

  constructor(protected facturacionService: FacturacionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.facturacionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
