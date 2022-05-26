import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FormaDePagoService } from '../service/forma-de-pago.service';
import { IFormaDePago, FormaDePago } from '../forma-de-pago.model';

import { FormaDePagoUpdateComponent } from './forma-de-pago-update.component';

describe('FormaDePago Management Update Component', () => {
  let comp: FormaDePagoUpdateComponent;
  let fixture: ComponentFixture<FormaDePagoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let formaDePagoService: FormaDePagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FormaDePagoUpdateComponent],
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
      .overrideTemplate(FormaDePagoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FormaDePagoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    formaDePagoService = TestBed.inject(FormaDePagoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const formaDePago: IFormaDePago = { id: 456 };

      activatedRoute.data = of({ formaDePago });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(formaDePago));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FormaDePago>>();
      const formaDePago = { id: 123 };
      jest.spyOn(formaDePagoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formaDePago });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formaDePago }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(formaDePagoService.update).toHaveBeenCalledWith(formaDePago);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FormaDePago>>();
      const formaDePago = new FormaDePago();
      jest.spyOn(formaDePagoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formaDePago });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formaDePago }));
      saveSubject.complete();

      // THEN
      expect(formaDePagoService.create).toHaveBeenCalledWith(formaDePago);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FormaDePago>>();
      const formaDePago = { id: 123 };
      jest.spyOn(formaDePagoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formaDePago });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(formaDePagoService.update).toHaveBeenCalledWith(formaDePago);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
