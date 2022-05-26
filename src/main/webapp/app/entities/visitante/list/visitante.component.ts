import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVisitante } from '../visitante.model';
import { VisitanteService } from '../service/visitante.service';
import { VisitanteDeleteDialogComponent } from '../delete/visitante-delete-dialog.component';

@Component({
  selector: 'easyparking-visitante',
  templateUrl: './visitante.component.html',
})
export class VisitanteComponent implements OnInit {
  visitantes?: IVisitante[];
  isLoading = false;

  constructor(protected visitanteService: VisitanteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.visitanteService.query().subscribe({
      next: (res: HttpResponse<IVisitante[]>) => {
        this.isLoading = false;
        this.visitantes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IVisitante): number {
    return item.id!;
  }

  delete(visitante: IVisitante): void {
    const modalRef = this.modalService.open(VisitanteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.visitante = visitante;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
