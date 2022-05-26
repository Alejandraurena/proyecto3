import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITarifaPlana } from '../tarifa-plana.model';
import { TarifaPlanaService } from '../service/tarifa-plana.service';
import { TarifaPlanaDeleteDialogComponent } from '../delete/tarifa-plana-delete-dialog.component';

@Component({
  selector: 'easyparking-tarifa-plana',
  templateUrl: './tarifa-plana.component.html',
})
export class TarifaPlanaComponent implements OnInit {
  tarifaPlanas?: ITarifaPlana[];
  isLoading = false;

  constructor(protected tarifaPlanaService: TarifaPlanaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.tarifaPlanaService.query().subscribe({
      next: (res: HttpResponse<ITarifaPlana[]>) => {
        this.isLoading = false;
        this.tarifaPlanas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ITarifaPlana): number {
    return item.id!;
  }

  delete(tarifaPlana: ITarifaPlana): void {
    const modalRef = this.modalService.open(TarifaPlanaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tarifaPlana = tarifaPlana;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
