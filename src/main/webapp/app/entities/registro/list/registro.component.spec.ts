import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RegistroService } from '../service/registro.service';

import { RegistroComponent } from './registro.component';

describe('Registro Management Component', () => {
  let comp: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let service: RegistroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RegistroComponent],
    })
      .overrideTemplate(RegistroComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RegistroService);

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
    expect(comp.registros?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
