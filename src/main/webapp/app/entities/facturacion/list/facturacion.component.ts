import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFacturacion } from '../facturacion.model';
import { FacturacionService } from '../service/facturacion.service';
import { FacturacionDeleteDialogComponent } from '../delete/facturacion-delete-dialog.component';

@Component({
  selector: 'easyparking-facturacion',
  templateUrl: './facturacion.component.html',
})
export class FacturacionComponent implements OnInit {
  facturacions?: IFacturacion[];
  isLoading = false;

  constructor(protected facturacionService: FacturacionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.facturacionService.query().subscribe({
      next: (res: HttpResponse<IFacturacion[]>) => {
        this.isLoading = false;
        this.facturacions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFacturacion): number {
    return item.id!;
  }

  delete(facturacion: IFacturacion): void {
    const modalRef = this.modalService.open(FacturacionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.facturacion = facturacion;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
