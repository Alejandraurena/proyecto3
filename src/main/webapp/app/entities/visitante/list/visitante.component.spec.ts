import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { VisitanteService } from '../service/visitante.service';

import { VisitanteComponent } from './visitante.component';

describe('Visitante Management Component', () => {
  let comp: VisitanteComponent;
  let fixture: ComponentFixture<VisitanteComponent>;
  let service: VisitanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [VisitanteComponent],
    })
      .overrideTemplate(VisitanteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VisitanteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VisitanteService);

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
    expect(comp.visitantes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
