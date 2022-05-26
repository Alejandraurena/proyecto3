import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EmpleadoService } from '../service/empleado.service';
import { IEmpleado, Empleado } from '../empleado.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { IVisitante } from 'app/entities/visitante/visitante.model';
import { VisitanteService } from 'app/entities/visitante/service/visitante.service';
import { IRegistro } from 'app/entities/registro/registro.model';
import { RegistroService } from 'app/entities/registro/service/registro.service';

import { EmpleadoUpdateComponent } from './empleado-update.component';

describe('Empleado Management Update Component', () => {
  let comp: EmpleadoUpdateComponent;
  let fixture: ComponentFixture<EmpleadoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let empleadoService: EmpleadoService;
  let userService: UserService;
  let clienteService: ClienteService;
  let visitanteService: VisitanteService;
  let registroService: RegistroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EmpleadoUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EmpleadoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmpleadoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    empleadoService = TestBed.inject(EmpleadoService);
    userService = TestBed.inject(UserService);
    clienteService = TestBed.inject(ClienteService);
    visitanteService = TestBed.inject(VisitanteService);
    registroService = TestBed.inject(RegistroService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const empleado: IEmpleado = { id: 456 };
      const user: IUser = { id: 56411 };
      empleado.user = user;

      const userCollection: IUser[] = [{ id: 39897 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ empleado });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Cliente query and add missing value', () => {
      const empleado: IEmpleado = { id: 456 };
      const cliente: ICliente = { id: 65071 };
      empleado.cliente = cliente;

      const clienteCollection: ICliente[] = [{ id: 52313 }];
      jest.spyOn(clienteService, 'query').mockReturnValue(of(new HttpResponse({ body: clienteCollection })));
      const additionalClientes = [cliente];
      const expectedCollection: ICliente[] = [...additionalClientes, ...clienteCollection];
      jest.spyOn(clienteService, 'addClienteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ empleado });
      comp.ngOnInit();

      expect(clienteService.query).toHaveBeenCalled();
      expect(clienteService.addClienteToCollectionIfMissing).toHaveBeenCalledWith(clienteCollection, ...additionalClientes);
      expect(comp.clientesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Visitante query and add missing value', () => {
      const empleado: IEmpleado = { id: 456 };
      const visitante: IVisitante = { id: 14087 };
      empleado.visitante = visitante;

      const visitanteCollection: IVisitante[] = [{ id: 84990 }];
      jest.spyOn(visitanteService, 'query').mockReturnValue(of(new HttpResponse({ body: visitanteCollection })));
      const additionalVisitantes = [visitante];
      const expectedCollection: IVisitante[] = [...additionalVisitantes, ...visitanteCollection];
      jest.spyOn(visitanteService, 'addVisitanteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ empleado });
      comp.ngOnInit();

      expect(visitanteService.query).toHaveBeenCalled();
      expect(visitanteService.addVisitanteToCollectionIfMissing).toHaveBeenCalledWith(visitanteCollection, ...additionalVisitantes);
      expect(comp.visitantesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Registro query and add missing value', () => {
      const empleado: IEmpleado = { id: 456 };
      const registro: IRegistro = { id: 54286 };
      empleado.registro = registro;

      const registroCollection: IRegistro[] = [{ id: 75073 }];
      jest.spyOn(registroService, 'query').mockReturnValue(of(new HttpResponse({ body: registroCollection })));
      const additionalRegistros = [registro];
      const expectedCollection: IRegistro[] = [...additionalRegistros, ...registroCollection];
      jest.spyOn(registroService, 'addRegistroToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ empleado });
      comp.ngOnInit();

      expect(registroService.query).toHaveBeenCalled();
      expect(registroService.addRegistroToCollectionIfMissing).toHaveBeenCalledWith(registroCollection, ...additionalRegistros);
      expect(comp.registrosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const empleado: IEmpleado = { id: 456 };
      const user: IUser = { id: 79149 };
      empleado.user = user;
      const cliente: ICliente = { id: 76963 };
      empleado.cliente = cliente;
      const visitante: IVisitante = { id: 38682 };
      empleado.visitante = visitante;
      const registro: IRegistro = { id: 37729 };
      empleado.registro = registro;

      activatedRoute.data = of({ empleado });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(empleado));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.clientesSharedCollection).toContain(cliente);
      expect(comp.visitantesSharedCollection).toContain(visitante);
      expect(comp.registrosSharedCollection).toContain(registro);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Empleado>>();
      const empleado = { id: 123 };
      jest.spyOn(empleadoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ empleado });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: empleado }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(empleadoService.update).toHaveBeenCalledWith(empleado);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Empleado>>();
      const empleado = new Empleado();
      jest.spyOn(empleadoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ empleado });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: empleado }));
      saveSubject.complete();

      // THEN
      expect(empleadoService.create).toHaveBeenCalledWith(empleado);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Empleado>>();
      const empleado = { id: 123 };
      jest.spyOn(empleadoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ empleado });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(empleadoService.update).toHaveBeenCalledWith(empleado);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackClienteById', () => {
      it('Should return tracked Cliente primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackClienteById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackVisitanteById', () => {
      it('Should return tracked Visitante primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackVisitanteById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackRegistroById', () => {
      it('Should return tracked Registro primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackRegistroById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
