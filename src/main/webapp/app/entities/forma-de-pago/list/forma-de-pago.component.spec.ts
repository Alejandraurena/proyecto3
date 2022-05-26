import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FormaDePagoService } from '../service/forma-de-pago.service';

import { FormaDePagoComponent } from './forma-de-pago.component';

describe('FormaDePago Management Component', () => {
  let comp: FormaDePagoComponent;
  let fixture: ComponentFixture<FormaDePagoComponent>;
  let service: FormaDePagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FormaDePagoComponent],
    })
      .overrideTemplate(FormaDePagoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FormaDePagoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FormaDePagoService);

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
    expect(comp.formaDePagos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
