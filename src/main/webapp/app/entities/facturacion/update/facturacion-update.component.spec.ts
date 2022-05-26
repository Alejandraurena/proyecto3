import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FacturacionService } from '../service/facturacion.service';
import { IFacturacion, Facturacion } from '../facturacion.model';
import { IFormaDePago } from 'app/entities/forma-de-pago/forma-de-pago.model';
import { FormaDePagoService } from 'app/entities/forma-de-pago/service/forma-de-pago.service';

import { FacturacionUpdateComponent } from './facturacion-update.component';

describe('Facturacion Management Update Component', () => {
  let comp: FacturacionUpdateComponent;
  let fixture: ComponentFixture<FacturacionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let facturacionService: FacturacionService;
  let formaDePagoService: FormaDePagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FacturacionUpdateComponent],
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
      .overrideTemplate(FacturacionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FacturacionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    facturacionService = TestBed.inject(FacturacionService);
    formaDePagoService = TestBed.inject(FormaDePagoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call FormaDePago query and add missing value', () => {
      const facturacion: IFacturacion = { id: 456 };
      const formaDepago: IFormaDePago = { id: 15243 };
      facturacion.formaDepago = formaDepago;

      const formaDePagoCollection: IFormaDePago[] = [{ id: 12887 }];
      jest.spyOn(formaDePagoService, 'query').mockReturnValue(of(new HttpResponse({ body: formaDePagoCollection })));
      const additionalFormaDePagos = [formaDepago];
      const expectedCollection: IFormaDePago[] = [...additionalFormaDePagos, ...formaDePagoCollection];
      jest.spyOn(formaDePagoService, 'addFormaDePagoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ facturacion });
      comp.ngOnInit();

      expect(formaDePagoService.query).toHaveBeenCalled();
      expect(formaDePagoService.addFormaDePagoToCollectionIfMissing).toHaveBeenCalledWith(formaDePagoCollection, ...additionalFormaDePagos);
      expect(comp.formaDePagosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const facturacion: IFacturacion = { id: 456 };
      const formaDepago: IFormaDePago = { id: 7290 };
      facturacion.formaDepago = formaDepago;

      activatedRoute.data = of({ facturacion });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(facturacion));
      expect(comp.formaDePagosSharedCollection).toContain(formaDepago);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Facturacion>>();
      const facturacion = { id: 123 };
      jest.spyOn(facturacionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ facturacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: facturacion }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(facturacionService.update).toHaveBeenCalledWith(facturacion);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Facturacion>>();
      const facturacion = new Facturacion();
      jest.spyOn(facturacionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ facturacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: facturacion }));
      saveSubject.complete();

      // THEN
      expect(facturacionService.create).toHaveBeenCalledWith(facturacion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Facturacion>>();
      const facturacion = { id: 123 };
      jest.spyOn(facturacionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ facturacion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(facturacionService.update).toHaveBeenCalledWith(facturacion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackFormaDePagoById', () => {
      it('Should return tracked FormaDePago primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackFormaDePagoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
