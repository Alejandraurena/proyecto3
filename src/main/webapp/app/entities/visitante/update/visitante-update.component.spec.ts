import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VisitanteService } from '../service/visitante.service';
import { IVisitante, Visitante } from '../visitante.model';

import { VisitanteUpdateComponent } from './visitante-update.component';

describe('Visitante Management Update Component', () => {
  let comp: VisitanteUpdateComponent;
  let fixture: ComponentFixture<VisitanteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let visitanteService: VisitanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VisitanteUpdateComponent],
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
      .overrideTemplate(VisitanteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VisitanteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    visitanteService = TestBed.inject(VisitanteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const visitante: IVisitante = { id: 456 };

      activatedRoute.data = of({ visitante });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(visitante));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Visitante>>();
      const visitante = { id: 123 };
      jest.spyOn(visitanteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ visitante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: visitante }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(visitanteService.update).toHaveBeenCalledWith(visitante);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Visitante>>();
      const visitante = new Visitante();
      jest.spyOn(visitanteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ visitante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: visitante }));
      saveSubject.complete();

      // THEN
      expect(visitanteService.create).toHaveBeenCalledWith(visitante);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Visitante>>();
      const visitante = { id: 123 };
      jest.spyOn(visitanteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ visitante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(visitanteService.update).toHaveBeenCalledWith(visitante);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
