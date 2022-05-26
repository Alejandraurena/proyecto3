import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FacturacionDetailComponent } from './facturacion-detail.component';

describe('Facturacion Management Detail Component', () => {
  let comp: FacturacionDetailComponent;
  let fixture: ComponentFixture<FacturacionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacturacionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ facturacion: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FacturacionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FacturacionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load facturacion on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.facturacion).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
