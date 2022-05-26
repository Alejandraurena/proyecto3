import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRegistro } from '../registro.model';
import { RegistroService } from '../service/registro.service';

@Component({
  templateUrl: './registro-delete-dialog.component.html',
})
export class RegistroDeleteDialogComponent {
  registro?: IRegistro;

  constructor(protected registroService: RegistroService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.registroService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
