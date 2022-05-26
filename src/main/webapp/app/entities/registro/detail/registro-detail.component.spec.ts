import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RegistroDetailComponent } from './registro-detail.component';

describe('Registro Management Detail Component', () => {
  let comp: RegistroDetailComponent;
  let fixture: ComponentFixture<RegistroDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ registro: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RegistroDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RegistroDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load registro on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.registro).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
