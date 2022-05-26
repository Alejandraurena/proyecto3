import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVisitante } from '../visitante.model';
import { VisitanteService } from '../service/visitante.service';

@Component({
  templateUrl: './visitante-delete-dialog.component.html',
})
export class VisitanteDeleteDialogComponent {
  visitante?: IVisitante;

  constructor(protected visitanteService: VisitanteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.visitanteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
