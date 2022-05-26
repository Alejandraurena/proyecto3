import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICliente, Cliente } from '../cliente.model';
import { ClienteService } from '../service/cliente.service';

@Component({
  selector: 'easyparking-cliente-update',
  templateUrl: './cliente-update.component.html',
})
export class ClienteUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nombreCliente: [null, [Validators.required, Validators.maxLength(25)]],
    apellidocliente: [null, [Validators.required, Validators.maxLength(25)]],
    bloqueCliente: [null, [Validators.required, Validators.maxLength(25)]],
    phone: [null, [Validators.required, Validators.maxLength(25)]],
    correoCliente: [null, [Validators.required, Validators.maxLength(25)]],
  });

  constructor(protected clienteService: ClienteService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cliente }) => {
      this.updateForm(cliente);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cliente = this.createFromForm();
    if (cliente.id !== undefined) {
      this.subscribeToSaveResponse(this.clienteService.update(cliente));
    } else {
      this.subscribeToSaveResponse(this.clienteService.create(cliente));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICliente>>): void {
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

  protected updateForm(cliente: ICliente): void {
    this.editForm.patchValue({
      id: cliente.id,
      nombreCliente: cliente.nombreCliente,
      apellidocliente: cliente.apellidocliente,
      bloqueCliente: cliente.bloqueCliente,
      phone: cliente.phone,
      correoCliente: cliente.correoCliente,
    });
  }

  protected createFromForm(): ICliente {
    return {
      ...new Cliente(),
      id: this.editForm.get(['id'])!.value,
      nombreCliente: this.editForm.get(['nombreCliente'])!.value,
      apellidocliente: this.editForm.get(['apellidocliente'])!.value,
      bloqueCliente: this.editForm.get(['bloqueCliente'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      correoCliente: this.editForm.get(['correoCliente'])!.value,
    };
  }
}
