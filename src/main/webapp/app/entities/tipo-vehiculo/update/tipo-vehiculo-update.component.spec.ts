import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TipoVehiculoService } from '../service/tipo-vehiculo.service';
import { ITipoVehiculo, TipoVehiculo } from '../tipo-vehiculo.model';
import { IFacturacion } from 'app/entities/facturacion/facturacion.model';
import { FacturacionService } from 'app/entities/facturacion/service/facturacion.service';

import { TipoVehiculoUpdateComponent } from './tipo-vehiculo-update.component';

describe('TipoVehiculo Management Update Component', () => {
  let comp: TipoVehiculoUpdateComponent;
  let fixture: ComponentFixture<TipoVehiculoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tipoVehiculoService: TipoVehiculoService;
  let facturacionService: FacturacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TipoVehiculoUpdateComponent],
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
      .overrideTemplate(TipoVehiculoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TipoVehiculoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tipoVehiculoService = TestBed.inject(TipoVehiculoService);
    facturacionService = TestBed.inject(FacturacionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Facturacion query and add missing value', () => {
      const tipoVehiculo: ITipoVehiculo = { id: 456 };
      const facturacion: IFacturacion = { id: 22901 };
      tipoVehiculo.facturacion = facturacion;

      const facturacionCollection: IFacturacion[] = [{ id: 565 }];
      jest.spyOn(facturacionService, 'query').mockReturnValue(of(new HttpResponse({ body: facturacionCollection })));
      const additionalFacturacions = [facturacion];
      const expectedCollection: IFacturacion[] = [...additionalFacturacions, ...facturacionCollection];
      jest.spyOn(facturacionService, 'addFacturacionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tipoVehiculo });
      comp.ngOnInit();

      expect(facturacionService.query).toHaveBeenCalled();
      expect(facturacionService.addFacturacionToCollectionIfMissing).toHaveBeenCalledWith(facturacionCollection, ...additionalFacturacions);
      expect(comp.facturacionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const tipoVehiculo: ITipoVehiculo = { id: 456 };
      const facturacion: IFacturacion = { id: 22567 };
      tipoVehiculo.facturacion = facturacion;

      activatedRoute.data = of({ tipoVehiculo });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(tipoVehiculo));
      expect(comp.facturacionsSharedCollection).toContain(facturacion);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TipoVehiculo>>();
      const tipoVehiculo = { id: 123 };
      jest.spyOn(tipoVehiculoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoVehiculo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tipoVehiculo }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(tipoVehiculoService.update).toHaveBeenCalledWith(tipoVehiculo);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TipoVehiculo>>();
      const tipoVehiculo = new TipoVehiculo();
      jest.spyOn(tipoVehiculoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoVehiculo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tipoVehiculo }));
      saveSubject.complete();

      // THEN
      expect(tipoVehiculoService.create).toHaveBeenCalledWith(tipoVehiculo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TipoVehiculo>>();
      const tipoVehiculo = { id: 123 };
      jest.spyOn(tipoVehiculoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoVehiculo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tipoVehiculoService.update).toHaveBeenCalledWith(tipoVehiculo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackFacturacionById', () => {
      it('Should return tracked Facturacion primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackFacturacionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
