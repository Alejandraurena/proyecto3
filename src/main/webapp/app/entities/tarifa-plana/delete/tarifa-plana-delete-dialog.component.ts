import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITarifaPlana } from '../tarifa-plana.model';
import { TarifaPlanaService } from '../service/tarifa-plana.service';

@Component({
  templateUrl: './tarifa-plana-delete-dialog.component.html',
})
export class TarifaPlanaDeleteDialogComponent {
  tarifaPlana?: ITarifaPlana;

  constructor(protected tarifaPlanaService: TarifaPlanaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tarifaPlanaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
