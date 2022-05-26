import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RegistroService } from '../service/registro.service';
import { IRegistro, Registro } from '../registro.model';
import { IVehiculo } from 'app/entities/vehiculo/vehiculo.model';
import { VehiculoService } from 'app/entities/vehiculo/service/vehiculo.service';

import { RegistroUpdateComponent } from './registro-update.component';

describe('Registro Management Update Component', () => {
  let comp: RegistroUpdateComponent;
  let fixture: ComponentFixture<RegistroUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let registroService: RegistroService;
  let vehiculoService: VehiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RegistroUpdateComponent],
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
      .overrideTemplate(RegistroUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RegistroUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    registroService = TestBed.inject(RegistroService);
    vehiculoService = TestBed.inject(VehiculoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Vehiculo query and add missing value', () => {
      const registro: IRegistro = { id: 456 };
      const vehiculo: IVehiculo = { id: 12072 };
      registro.vehiculo = vehiculo;

      const vehiculoCollection: IVehiculo[] = [{ id: 94723 }];
      jest.spyOn(vehiculoService, 'query').mockReturnValue(of(new HttpResponse({ body: vehiculoCollection })));
      const additionalVehiculos = [vehiculo];
      const expectedCollection: IVehiculo[] = [...additionalVehiculos, ...vehiculoCollection];
      jest.spyOn(vehiculoService, 'addVehiculoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ registro });
      comp.ngOnInit();

      expect(vehiculoService.query).toHaveBeenCalled();
      expect(vehiculoService.addVehiculoToCollectionIfMissing).toHaveBeenCalledWith(vehiculoCollection, ...additionalVehiculos);
      expect(comp.vehiculosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const registro: IRegistro = { id: 456 };
      const vehiculo: IVehiculo = { id: 31393 };
      registro.vehiculo = vehiculo;

      activatedRoute.data = of({ registro });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(registro));
      expect(comp.vehiculosSharedCollection).toContain(vehiculo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Registro>>();
      const registro = { id: 123 };
      jest.spyOn(registroService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ registro });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: registro }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(registroService.update).toHaveBeenCalledWith(registro);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Registro>>();
      const registro = new Registro();
      jest.spyOn(registroService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ registro });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: registro }));
      saveSubject.complete();

      // THEN
      expect(registroService.create).toHaveBeenCalledWith(registro);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Registro>>();
      const registro = { id: 123 };
      jest.spyOn(registroService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ registro });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(registroService.update).toHaveBeenCalledWith(registro);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackVehiculoById', () => {
      it('Should return tracked Vehiculo primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackVehiculoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
