import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVehiculo, Vehiculo } from '../vehiculo.model';
import { VehiculoService } from '../service/vehiculo.service';
import { ITipoVehiculo } from 'app/entities/tipo-vehiculo/tipo-vehiculo.model';
import { TipoVehiculoService } from 'app/entities/tipo-vehiculo/service/tipo-vehiculo.service';

@Component({
  selector: 'easyparking-vehiculo-update',
  templateUrl: './vehiculo-update.component.html',
})
export class VehiculoUpdateComponent implements OnInit {
  isSaving = false;

  tipoVehiculosSharedCollection: ITipoVehiculo[] = [];

  editForm = this.fb.group({
    id: [],
    placa: [null, [Validators.required, Validators.maxLength(20)]],
    tipoVehiculo: [null, Validators.required],
  });

  constructor(
    protected vehiculoService: VehiculoService,
    protected tipoVehiculoService: TipoVehiculoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vehiculo }) => {
      this.updateForm(vehiculo);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vehiculo = this.createFromForm();
    if (vehiculo.id !== undefined) {
      this.subscribeToSaveResponse(this.vehiculoService.update(vehiculo));
    } else {
      this.subscribeToSaveResponse(this.vehiculoService.create(vehiculo));
    }
  }

  trackTipoVehiculoById(_index: number, item: ITipoVehiculo): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVehiculo>>): void {
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

  protected updateForm(vehiculo: IVehiculo): void {
    this.editForm.patchValue({
      id: vehiculo.id,
      placa: vehiculo.placa,
      tipoVehiculo: vehiculo.tipoVehiculo,
    });

    this.tipoVehiculosSharedCollection = this.tipoVehiculoService.addTipoVehiculoToCollectionIfMissing(
      this.tipoVehiculosSharedCollection,
      vehiculo.tipoVehiculo
    );
  }

  protected loadRelationshipsOptions(): void {
    this.tipoVehiculoService
      .query()
      .pipe(map((res: HttpResponse<ITipoVehiculo[]>) => res.body ?? []))
      .pipe(
        map((tipoVehiculos: ITipoVehiculo[]) =>
          this.tipoVehiculoService.addTipoVehiculoToCollectionIfMissing(tipoVehiculos, this.editForm.get('tipoVehiculo')!.value)
        )
      )
      .subscribe((tipoVehiculos: ITipoVehiculo[]) => (this.tipoVehiculosSharedCollection = tipoVehiculos));
  }

  protected createFromForm(): IVehiculo {
    return {
      ...new Vehiculo(),
      id: this.editForm.get(['id'])!.value,
      placa: this.editForm.get(['placa'])!.value,
      tipoVehiculo: this.editForm.get(['tipoVehiculo'])!.value,
    };
  }
}
