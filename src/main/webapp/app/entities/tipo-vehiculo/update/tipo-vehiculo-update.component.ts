import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITipoVehiculo, TipoVehiculo } from '../tipo-vehiculo.model';
import { TipoVehiculoService } from '../service/tipo-vehiculo.service';
import { IFacturacion } from 'app/entities/facturacion/facturacion.model';
import { FacturacionService } from 'app/entities/facturacion/service/facturacion.service';

@Component({
  selector: 'easyparking-tipo-vehiculo-update',
  templateUrl: './tipo-vehiculo-update.component.html',
})
export class TipoVehiculoUpdateComponent implements OnInit {
  isSaving = false;

  facturacionsSharedCollection: IFacturacion[] = [];

  editForm = this.fb.group({
    id: [],
    tipoVehiculo: [null, [Validators.required, Validators.maxLength(25)]],
    marcaVehiculo: [null, [Validators.required, Validators.maxLength(25)]],
    facturacion: [null, Validators.required],
  });

  constructor(
    protected tipoVehiculoService: TipoVehiculoService,
    protected facturacionService: FacturacionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tipoVehiculo }) => {
      this.updateForm(tipoVehiculo);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tipoVehiculo = this.createFromForm();
    if (tipoVehiculo.id !== undefined) {
      this.subscribeToSaveResponse(this.tipoVehiculoService.update(tipoVehiculo));
    } else {
      this.subscribeToSaveResponse(this.tipoVehiculoService.create(tipoVehiculo));
    }
  }

  trackFacturacionById(_index: number, item: IFacturacion): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITipoVehiculo>>): void {
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

  protected updateForm(tipoVehiculo: ITipoVehiculo): void {
    this.editForm.patchValue({
      id: tipoVehiculo.id,
      tipoVehiculo: tipoVehiculo.tipoVehiculo,
      marcaVehiculo: tipoVehiculo.marcaVehiculo,
      facturacion: tipoVehiculo.facturacion,
    });

    this.facturacionsSharedCollection = this.facturacionService.addFacturacionToCollectionIfMissing(
      this.facturacionsSharedCollection,
      tipoVehiculo.facturacion
    );
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
  }

  protected createFromForm(): ITipoVehiculo {
    return {
      ...new TipoVehiculo(),
      id: this.editForm.get(['id'])!.value,
      tipoVehiculo: this.editForm.get(['tipoVehiculo'])!.value,
      marcaVehiculo: this.editForm.get(['marcaVehiculo'])!.value,
      facturacion: this.editForm.get(['facturacion'])!.value,
    };
  }
}
