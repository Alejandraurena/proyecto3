import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { VehiculoService } from '../service/vehiculo.service';

import { VehiculoComponent } from './vehiculo.component';

describe('Vehiculo Management Component', () => {
  let comp: VehiculoComponent;
  let fixture: ComponentFixture<VehiculoComponent>;
  let service: VehiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [VehiculoComponent],
    })
      .overrideTemplate(VehiculoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VehiculoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VehiculoService);

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
    expect(comp.vehiculos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
