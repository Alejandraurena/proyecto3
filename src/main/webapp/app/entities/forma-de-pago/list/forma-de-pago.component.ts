import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormaDePago } from '../forma-de-pago.model';
import { FormaDePagoService } from '../service/forma-de-pago.service';
import { FormaDePagoDeleteDialogComponent } from '../delete/forma-de-pago-delete-dialog.component';

@Component({
  selector: 'easyparking-forma-de-pago',
  templateUrl: './forma-de-pago.component.html',
})
export class FormaDePagoComponent implements OnInit {
  formaDePagos?: IFormaDePago[];
  isLoading = false;

  constructor(protected formaDePagoService: FormaDePagoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.formaDePagoService.query().subscribe({
      next: (res: HttpResponse<IFormaDePago[]>) => {
        this.isLoading = false;
        this.formaDePagos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFormaDePago): number {
    return item.id!;
  }

  delete(formaDePago: IFormaDePago): void {
    const modalRef = this.modalService.open(FormaDePagoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.formaDePago = formaDePago;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
