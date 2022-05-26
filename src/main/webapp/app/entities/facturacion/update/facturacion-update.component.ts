import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFacturacion, Facturacion } from '../facturacion.model';
import { FacturacionService } from '../service/facturacion.service';
import { IFormaDePago } from 'app/entities/forma-de-pago/forma-de-pago.model';
import { FormaDePagoService } from 'app/entities/forma-de-pago/service/forma-de-pago.service';

@Component({
  selector: 'easyparking-facturacion-update',
  templateUrl: './facturacion-update.component.html',
})
export class FacturacionUpdateComponent implements OnInit {
  isSaving = false;

  formaDePagosSharedCollection: IFormaDePago[] = [];

  editForm = this.fb.group({
    id: [],
    fechaFactura: [null, [Validators.required]],
    valorFactura: [null, [Validators.required]],
    formaDepago: [null, Validators.required],
  });

  constructor(
    protected facturacionService: FacturacionService,
    protected formaDePagoService: FormaDePagoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ facturacion }) => {
      this.updateForm(facturacion);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const facturacion = this.createFromForm();
    if (facturacion.id !== undefined) {
      this.subscribeToSaveResponse(this.facturacionService.update(facturacion));
    } else {
      this.subscribeToSaveResponse(this.facturacionService.create(facturacion));
    }
  }

  trackFormaDePagoById(_index: number, item: IFormaDePago): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFacturacion>>): void {
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

  protected updateForm(facturacion: IFacturacion): void {
    this.editForm.patchValue({
      id: facturacion.id,
      fechaFactura: facturacion.fechaFactura,
      valorFactura: facturacion.valorFactura,
      formaDepago: facturacion.formaDepago,
    });

    this.formaDePagosSharedCollection = this.formaDePagoService.addFormaDePagoToCollectionIfMissing(
      this.formaDePagosSharedCollection,
      facturacion.formaDepago
    );
  }

  protected loadRelationshipsOptions(): void {
    this.formaDePagoService
      .query()
      .pipe(map((res: HttpResponse<IFormaDePago[]>) => res.body ?? []))
      .pipe(
        map((formaDePagos: IFormaDePago[]) =>
          this.formaDePagoService.addFormaDePagoToCollectionIfMissing(formaDePagos, this.editForm.get('formaDepago')!.value)
        )
      )
      .subscribe((formaDePagos: IFormaDePago[]) => (this.formaDePagosSharedCollection = formaDePagos));
  }

  protected createFromForm(): IFacturacion {
    return {
      ...new Facturacion(),
      id: this.editForm.get(['id'])!.value,
      fechaFactura: this.editForm.get(['fechaFactura'])!.value,
      valorFactura: this.editForm.get(['valorFactura'])!.value,
      formaDepago: this.editForm.get(['formaDepago'])!.value,
    };
  }
}
