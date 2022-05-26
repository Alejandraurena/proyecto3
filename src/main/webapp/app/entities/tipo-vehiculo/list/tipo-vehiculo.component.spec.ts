import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TipoVehiculoService } from '../service/tipo-vehiculo.service';

import { TipoVehiculoComponent } from './tipo-vehiculo.component';

describe('TipoVehiculo Management Component', () => {
  let comp: TipoVehiculoComponent;
  let fixture: ComponentFixture<TipoVehiculoComponent>;
  let service: TipoVehiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TipoVehiculoComponent],
    })
      .overrideTemplate(TipoVehiculoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TipoVehiculoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TipoVehiculoService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.tipoVehiculos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
