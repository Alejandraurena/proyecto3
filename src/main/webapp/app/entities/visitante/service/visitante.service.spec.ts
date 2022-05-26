import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVisitante, Visitante } from '../visitante.model';

import { VisitanteService } from './visitante.service';

describe('Visitante Service', () => {
  let service: VisitanteService;
  let httpMock: HttpTestingController;
  let elemDefault: IVisitante;
  let expectedResult: IVisitante | IVisitante[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VisitanteService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nombrevisitante: 'AAAAAAA',
      apellido: 'AAAAAAA',
      phone: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Visitante', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Visitante()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Visitante', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombrevisitante: 'BBBBBB',
          apellido: 'BBBBBB',
          phone: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Visitante', () => {
      const patchObject = Object.assign(
        {
          apellido: 'BBBBBB',
        },
        new Visitante()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Visitante', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombrevisitante: 'BBBBBB',
          apellido: 'BBBBBB',
          phone: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Visitante', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addVisitanteToCollectionIfMissing', () => {
      it('should add a Visitante to an empty array', () => {
        const visitante: IVisitante = { id: 123 };
        expectedResult = service.addVisitanteToCollectionIfMissing([], visitante);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(visitante);
      });

      it('should not add a Visitante to an array that contains it', () => {
        const visitante: IVisitante = { id: 123 };
        const visitanteCollection: IVisitante[] = [
          {
            ...visitante,
          },
          { id: 456 },
        ];
        expectedResult = service.addVisitanteToCollectionIfMissing(visitanteCollection, visitante);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Visitante to an array that doesn't contain it", () => {
        const visitante: IVisitante = { id: 123 };
        const visitanteCollection: IVisitante[] = [{ id: 456 }];
        expectedResult = service.addVisitanteToCollectionIfMissing(visitanteCollection, visitante);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(visitante);
      });

      it('should add only unique Visitante to an array', () => {
        const visitanteArray: IVisitante[] = [{ id: 123 }, { id: 456 }, { id: 8904 }];
        const visitanteCollection: IVisitante[] = [{ id: 123 }];
        expectedResult = service.addVisitanteToCollectionIfMissing(visitanteCollection, ...visitanteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const visitante: IVisitante = { id: 123 };
        const visitante2: IVisitante = { id: 456 };
        expectedResult = service.addVisitanteToCollectionIfMissing([], visitante, visitante2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(visitante);
        expect(expectedResult).toContain(visitante2);
      });

      it('should accept null and undefined values', () => {
        const visitante: IVisitante = { id: 123 };
        expectedResult = service.addVisitanteToCollectionIfMissing([], null, visitante, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(visitante);
      });

      it('should return initial array if no Visitante is added', () => {
        const visitanteCollection: IVisitante[] = [{ id: 123 }];
        expectedResult = service.addVisitanteToCollectionIfMissing(visitanteCollection, undefined, null);
        expect(expectedResult).toEqual(visitanteCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
