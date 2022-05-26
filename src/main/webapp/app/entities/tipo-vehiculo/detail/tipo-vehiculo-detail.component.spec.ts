import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TipoVehiculoDetailComponent } from './tipo-vehiculo-detail.component';

describe('TipoVehiculo Management Detail Component', () => {
  let comp: TipoVehiculoDetailComponent;
  let fixture: ComponentFixture<TipoVehiculoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipoVehiculoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ tipoVehiculo: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TipoVehiculoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TipoVehiculoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load tipoVehiculo on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.tipoVehiculo).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
