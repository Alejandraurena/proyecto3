import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITarifaPlana, TarifaPlana } from '../tarifa-plana.model';
import { TarifaPlanaService } from '../service/tarifa-plana.service';
import { IFacturacion } from 'app/entities/facturacion/facturacion.model';
import { FacturacionService } from 'app/entities/facturacion/service/facturacion.service';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';

@Component({
  selector: 'easyparking-tarifa-plana-update',
  templateUrl: './tarifa-plana-update.component.html',
})
export class TarifaPlanaUpdateComponent implements OnInit {
  isSaving = false;

  facturacionsSharedCollection: IFacturacion[] = [];
  clientesSharedCollection: ICliente[] = [];

  editForm = this.fb.group({
    id: [],
    valor: [null, [Validators.required]],
    fechaPago: [null, [Validators.required, Validators.maxLength(20)]],
    facturacion: [null, Validators.required],
    cliente: [null, Validators.required],
  });

  constructor(
    protected tarifaPlanaService: TarifaPlanaService,
    protected facturacionService: FacturacionService,
    protected clienteService: ClienteService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tarifaPlana }) => {
      this.updateForm(tarifaPlana);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tarifaPlana = this.createFromForm();
    if (tarifaPlana.id !== undefined) {
      this.subscribeToSaveResponse(this.tarifaPlanaService.update(tarifaPlana));
    } else {
      this.subscribeToSaveResponse(this.tarifaPlanaService.create(tarifaPlana));
    }
  }

  trackFacturacionById(_index: number, item: IFacturacion): number {
    return item.id!;
  }

  trackClienteById(_index: number, item: ICliente): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITarifaPlana>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(tarifaPlana: ITarifaPlana): void {
    this.editForm.patchValue({
      id: tarifaPlana.id,
      valor: tarifaPlana.valor,
      fechaPago: tarifaPlana.fechaPago,
      facturacion: tarifaPlana.facturacion,
      cliente: tarifaPlana.cliente,
    });

    this.facturacionsSharedCollection = this.facturacionService.addFacturacionToCollectionIfMissing(
      this.facturacionsSharedCollection,
      tarifaPlana.facturacion
    );
    this.clientesSharedCollection = this.clienteService.addClienteToCollectionIfMissing(this.clientesSharedCollection, tarifaPlana.cliente);
  }

  protected loadRelationshipsOptions(): void {
    this.facturacionService
      .query()
      .pipe(map((res: HttpResponse<IFacturacion[]>) => res.body ?? []))
      .pipe(
        map((facturacions: IFacturacion[]) =>
          this.facturacionService.addFacturacionToCollectionIfMissing(facturacions, this.editForm.get('facturacion')!.value)
        )
      )
      .subscribe((facturacions: IFacturacion[]) => (this.facturacionsSharedCollection = facturacions));

    this.clienteService
      .query()
      .pipe(map((res: HttpResponse<ICliente[]>) => res.body ?? []))
      .pipe(
        map((clientes: ICliente[]) => this.clienteService.addClienteToCollectionIfMissing(clientes, this.editForm.get('cliente')!.value))
      )
      .subscribe((clientes: ICliente[]) => (this.clientesSharedCollection = clientes));
  }

  protected createFromForm(): ITarifaPlana {
    return {
      ...new TarifaPlana(),
      id: this.editForm.get(['id'])!.value,
      valor: this.editForm.get(['valor'])!.value,
      fechaPago: this.editForm.get(['fechaPago'])!.value,
      facturacion: this.editForm.get(['facturacion'])!.value,
      cliente: this.editForm.get(['cliente'])!.value,
    };
  }
}
