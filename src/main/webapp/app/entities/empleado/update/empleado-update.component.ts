import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEmpleado, Empleado } from '../empleado.model';
import { EmpleadoService } from '../service/empleado.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { IVisitante } from 'app/entities/visitante/visitante.model';
import { VisitanteService } from 'app/entities/visitante/service/visitante.service';
import { IRegistro } from 'app/entities/registro/registro.model';
import { RegistroService } from 'app/entities/registro/service/registro.service';

@Component({
  selector: 'easyparking-empleado-update',
  templateUrl: './empleado-update.component.html',
})
export class EmpleadoUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  clientesSharedCollection: ICliente[] = [];
  visitantesSharedCollection: IVisitante[] = [];
  registrosSharedCollection: IRegistro[] = [];

  editForm = this.fb.group({
    id: [],
    nombreEmpleado: [null, [Validators.required, Validators.maxLength(20)]],
    apellidoEmpleado: [null, [Validators.maxLength(20)]],
    cargoEmpleado: [null, [Validators.required, Validators.maxLength(20)]],
    phone: [null, [Validators.required, Validators.maxLength(20)]],
    user: [null, Validators.required],
    cliente: [null, Validators.required],
    visitante: [null, Validators.required],
    registro: [null, Validators.required],
  });

  constructor(
    protected empleadoService: EmpleadoService,
    protected userService: UserService,
    protected clienteService: ClienteService,
    protected visitanteService: VisitanteService,
    protected registroService: RegistroService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ empleado }) => {
      this.updateForm(empleado);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const empleado = this.createFromForm();
    if (empleado.id !== undefined) {
      this.subscribeToSaveResponse(this.empleadoService.update(empleado));
    } else {
      this.subscribeToSaveResponse(this.empleadoService.create(empleado));
    }
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  trackClienteById(_index: number, item: ICliente): number {
    return item.id!;
  }

  trackVisitanteById(_index: number, item: IVisitante): number {
    return item.id!;
  }

  trackRegistroById(_index: number, item: IRegistro): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmpleado>>): void {
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

  protected updateForm(empleado: IEmpleado): void {
    this.editForm.patchValue({
      id: empleado.id,
      nombreEmpleado: empleado.nombreEmpleado,
      apellidoEmpleado: empleado.apellidoEmpleado,
      cargoEmpleado: empleado.cargoEmpleado,
      phone: empleado.phone,
      user: empleado.user,
      cliente: empleado.cliente,
      visitante: empleado.visitante,
      registro: empleado.registro,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, empleado.user);
    this.clientesSharedCollection = this.clienteService.addClienteToCollectionIfMissing(this.clientesSharedCollection, empleado.cliente);
    this.visitantesSharedCollection = this.visitanteService.addVisitanteToCollectionIfMissing(
      this.visitantesSharedCollection,
      empleado.visitante
    );
    this.registrosSharedCollection = this.registroService.addRegistroToCollectionIfMissing(
      this.registrosSharedCollection,
      empleado.registro
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.clienteService
      .query()
      .pipe(map((res: HttpResponse<ICliente[]>) => res.body ?? []))
      .pipe(
        map((clientes: ICliente[]) => this.clienteService.addClienteToCollectionIfMissing(clientes, this.editForm.get('cliente')!.value))
      )
      .subscribe((clientes: ICliente[]) => (this.clientesSharedCollection = clientes));

    this.visitanteService
      .query()
      .pipe(map((res: HttpResponse<IVisitante[]>) => res.body ?? []))
      .pipe(
        map((visitantes: IVisitante[]) =>
          this.visitanteService.addVisitanteToCollectionIfMissing(visitantes, this.editForm.get('visitante')!.value)
        )
      )
      .subscribe((visitantes: IVisitante[]) => (this.visitantesSharedCollection = visitantes));

    this.registroService
      .query()
      .pipe(map((res: HttpResponse<IRegistro[]>) => res.body ?? []))
      .pipe(
        map((registros: IRegistro[]) =>
          this.registroService.addRegistroToCollectionIfMissing(registros, this.editForm.get('registro')!.value)
        )
      )
      .subscribe((registros: IRegistro[]) => (this.registrosSharedCollection = registros));
  }

  protected createFromForm(): IEmpleado {
    return {
      ...new Empleado(),
      id: this.editForm.get(['id'])!.value,
      nombreEmpleado: this.editForm.get(['nombreEmpleado'])!.value,
      apellidoEmpleado: this.editForm.get(['apellidoEmpleado'])!.value,
      cargoEmpleado: this.editForm.get(['cargoEmpleado'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      user: this.editForm.get(['user'])!.value,
      cliente: this.editForm.get(['cliente'])!.value,
      visitante: this.editForm.get(['visitante'])!.value,
      registro: this.editForm.get(['registro'])!.value,
    };
  }
}
