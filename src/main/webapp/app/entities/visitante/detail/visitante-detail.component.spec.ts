import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VisitanteDetailComponent } from './visitante-detail.component';

describe('Visitante Management Detail Component', () => {
  let comp: VisitanteDetailComponent;
  let fixture: ComponentFixture<VisitanteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitanteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ visitante: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VisitanteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VisitanteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load visitante on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.visitante).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
