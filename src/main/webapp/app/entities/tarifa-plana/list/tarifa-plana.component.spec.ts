import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TarifaPlanaService } from '../service/tarifa-plana.service';

import { TarifaPlanaComponent } from './tarifa-plana.component';

describe('TarifaPlana Management Component', () => {
  let comp: TarifaPlanaComponent;
  let fixture: ComponentFixture<TarifaPlanaComponent>;
  let service: TarifaPlanaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TarifaPlanaComponent],
    })
      .overrideTemplate(TarifaPlanaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TarifaPlanaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TarifaPlanaService);

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
    expect(comp.tarifaPlanas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
