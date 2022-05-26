import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VehiculoService } from '../service/vehiculo.service';
import { IVehiculo, Vehiculo } from '../vehiculo.model';
import { ITipoVehiculo } from 'app/entities/tipo-vehiculo/tipo-vehiculo.model';
import { TipoVehiculoService } from 'app/entities/tipo-vehiculo/service/tipo-vehiculo.service';

import { VehiculoUpdateComponent } from './vehiculo-update.component';

describe('Vehiculo Management Update Component', () => {
  let comp: VehiculoUpdateComponent;
  let fixture: ComponentFixture<VehiculoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vehiculoService: VehiculoService;
  let tipoVehiculoService: TipoVehiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VehiculoUpdateComponent],
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
      .overrideTemplate(VehiculoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VehiculoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vehiculoService = TestBed.inject(VehiculoService);
    tipoVehiculoService = TestBed.inject(TipoVehiculoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TipoVehiculo query and add missing value', () => {
      const vehiculo: IVehiculo = { id: 456 };
      const tipoVehiculo: ITipoVehiculo = { id: 10549 };
      vehiculo.tipoVehiculo = tipoVehiculo;

      const tipoVehiculoCollection: ITipoVehiculo[] = [{ id: 85614 }];
      jest.spyOn(tipoVehiculoService, 'query').mockReturnValue(of(new HttpResponse({ body: tipoVehiculoCollection })));
      const additionalTipoVehiculos = [tipoVehiculo];
      const expectedCollection: ITipoVehiculo[] = [...additionalTipoVehiculos, ...tipoVehiculoCollection];
      jest.spyOn(tipoVehiculoService, 'addTipoVehiculoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ vehiculo });
      comp.ngOnInit();

      expect(tipoVehiculoService.query).toHaveBeenCalled();
      expect(tipoVehiculoService.addTipoVehiculoToCollectionIfMissing).toHaveBeenCalledWith(
        tipoVehiculoCollection,
        ...additionalTipoVehiculos
      );
      expect(comp.tipoVehiculosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const vehiculo: IVehiculo = { id: 456 };
      const tipoVehiculo: ITipoVehiculo = { id: 32573 };
      vehiculo.tipoVehiculo = tipoVehiculo;

      activatedRoute.data = of({ vehiculo });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(vehiculo));
      expect(comp.tipoVehiculosSharedCollection).toContain(tipoVehiculo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Vehiculo>>();
      const vehiculo = { id: 123 };
      jest.spyOn(vehiculoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehiculo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vehiculo }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(vehiculoService.update).toHaveBeenCalledWith(vehiculo);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Vehiculo>>();
      const vehiculo = new Vehiculo();
      jest.spyOn(vehiculoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehiculo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vehiculo }));
      saveSubject.complete();

      // THEN
      expect(vehiculoService.create).toHaveBeenCalledWith(vehiculo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Vehiculo>>();
      const vehiculo = { id: 123 };
      jest.spyOn(vehiculoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehiculo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vehiculoService.update).toHaveBeenCalledWith(vehiculo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTipoVehiculoById', () => {
      it('Should return tracked TipoVehiculo primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTipoVehiculoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
