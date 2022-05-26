import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRegistro } from '../registro.model';
import { RegistroService } from '../service/registro.service';
import { RegistroDeleteDialogComponent } from '../delete/registro-delete-dialog.component';

@Component({
  selector: 'easyparking-registro',
  templateUrl: './registro.component.html',
})
export class RegistroComponent implements OnInit {
  registros?: IRegistro[];
  isLoading = false;

  constructor(protected registroService: RegistroService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.registroService.query().subscribe({
      next: (res: HttpResponse<IRegistro[]>) => {
        this.isLoading = false;
        this.registros = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IRegistro): number {
    return item.id!;
  }

  delete(registro: IRegistro): void {
    const modalRef = this.modalService.open(RegistroDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.registro = registro;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
