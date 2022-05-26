import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FacturacionService } from '../service/facturacion.service';

import { FacturacionComponent } from './facturacion.component';

describe('Facturacion Management Component', () => {
  let comp: FacturacionComponent;
  let fixture: ComponentFixture<FacturacionComponent>;
  let service: FacturacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FacturacionComponent],
    })
      .overrideTemplate(FacturacionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FacturacionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FacturacionService);

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
    expect(comp.facturacions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
