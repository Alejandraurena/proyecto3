import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FormaDePagoDetailComponent } from './forma-de-pago-detail.component';

describe('FormaDePago Management Detail Component', () => {
  let comp: FormaDePagoDetailComponent;
  let fixture: ComponentFixture<FormaDePagoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormaDePagoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ formaDePago: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FormaDePagoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FormaDePagoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load formaDePago on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.formaDePago).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
