import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormaDePago } from '../forma-de-pago.model';
import { FormaDePagoService } from '../service/forma-de-pago.service';

@Component({
  templateUrl: './forma-de-pago-delete-dialog.component.html',
})
export class FormaDePagoDeleteDialogComponent {
  formaDePago?: IFormaDePago;

  constructor(protected formaDePagoService: FormaDePagoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.formaDePagoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
