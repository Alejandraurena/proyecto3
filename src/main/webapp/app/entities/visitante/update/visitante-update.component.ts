import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IVisitante, Visitante } from '../visitante.model';
import { VisitanteService } from '../service/visitante.service';

@Component({
  selector: 'easyparking-visitante-update',
  templateUrl: './visitante-update.component.html',
})
export class VisitanteUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nombrevisitante: [null, [Validators.required, Validators.maxLength(25)]],
    apellido: [null, [Validators.maxLength(25)]],
    phone: [null, [Validators.required, Validators.maxLength(25)]],
  });

  constructor(protected visitanteService: VisitanteService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ visitante }) => {
      this.updateForm(visitante);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const visitante = this.createFromForm();
    if (visitante.id !== undefined) {
      this.subscribeToSaveResponse(this.visitanteService.update(visitante));
    } else {
      this.subscribeToSaveResponse(this.visitanteService.create(visitante));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVisitante>>): void {
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

  protected updateForm(visitante: IVisitante): void {
    this.editForm.patchValue({
      id: visitante.id,
      nombrevisitante: visitante.nombrevisitante,
      apellido: visitante.apellido,
      phone: visitante.phone,
    });
  }

  protected createFromForm(): IVisitante {
    return {
      ...new Visitante(),
      id: this.editForm.get(['id'])!.value,
      nombrevisitante: this.editForm.get(['nombrevisitante'])!.value,
      apellido: this.editForm.get(['apellido'])!.value,
      phone: this.editForm.get(['phone'])!.value,
    };
  }
}
