import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TarifaPlanaDetailComponent } from './tarifa-plana-detail.component';

describe('TarifaPlana Management Detail Component', () => {
  let comp: TarifaPlanaDetailComponent;
  let fixture: ComponentFixture<TarifaPlanaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TarifaPlanaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ tarifaPlana: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TarifaPlanaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TarifaPlanaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load tarifaPlana on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.tarifaPlana).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
