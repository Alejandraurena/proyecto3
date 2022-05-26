import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITarifaPlana, TarifaPlana } from '../tarifa-plana.model';

import { TarifaPlanaService } from './tarifa-plana.service';

describe('TarifaPlana Service', () => {
  let service: TarifaPlanaService;
  let httpMock: HttpTestingController;
  let elemDefault: ITarifaPlana;
  let expectedResult: ITarifaPlana | ITarifaPlana[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TarifaPlanaService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      valor: 0,
      fechaPago: 'AAAAAAA',
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

    it('should create a TarifaPlana', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TarifaPlana()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TarifaPlana', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          valor: 1,
          fechaPago: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TarifaPlana', () => {
      const patchObject = Object.assign({}, new TarifaPlana());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TarifaPlana', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          valor: 1,
          fechaPago: 'BBBBBB',
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

    it('should delete a TarifaPlana', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTarifaPlanaToCollectionIfMissing', () => {
      it('should add a TarifaPlana to an empty array', () => {
        const tarifaPlana: ITarifaPlana = { id: 123 };
        expectedResult = service.addTarifaPlanaToCollectionIfMissing([], tarifaPlana);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tarifaPlana);
      });

      it('should not add a TarifaPlana to an array that contains it', () => {
        const tarifaPlana: ITarifaPlana = { id: 123 };
        const tarifaPlanaCollection: ITarifaPlana[] = [
          {
            ...tarifaPlana,
          },
          { id: 456 },
        ];
        expectedResult = service.addTarifaPlanaToCollectionIfMissing(tarifaPlanaCollection, tarifaPlana);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TarifaPlana to an array that doesn't contain it", () => {
        const tarifaPlana: ITarifaPlana = { id: 123 };
        const tarifaPlanaCollection: ITarifaPlana[] = [{ id: 456 }];
        expectedResult = service.addTarifaPlanaToCollectionIfMissing(tarifaPlanaCollection, tarifaPlana);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tarifaPlana);
      });

      it('should add only unique TarifaPlana to an array', () => {
        const tarifaPlanaArray: ITarifaPlana[] = [{ id: 123 }, { id: 456 }, { id: 13952 }];
        const tarifaPlanaCollection: ITarifaPlana[] = [{ id: 123 }];
        expectedResult = service.addTarifaPlanaToCollectionIfMissing(tarifaPlanaCollection, ...tarifaPlanaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tarifaPlana: ITarifaPlana = { id: 123 };
        const tarifaPlana2: ITarifaPlana = { id: 456 };
        expectedResult = service.addTarifaPlanaToCollectionIfMissing([], tarifaPlana, tarifaPlana2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tarifaPlana);
        expect(expectedResult).toContain(tarifaPlana2);
      });

      it('should accept null and undefined values', () => {
        const tarifaPlana: ITarifaPlana = { id: 123 };
        expectedResult = service.addTarifaPlanaToCollectionIfMissing([], null, tarifaPlana, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tarifaPlana);
      });

      it('should return initial array if no TarifaPlana is added', () => {
        const tarifaPlanaCollection: ITarifaPlana[] = [{ id: 123 }];
        expectedResult = service.addTarifaPlanaToCollectionIfMissing(tarifaPlanaCollection, undefined, null);
        expect(expectedResult).toEqual(tarifaPlanaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
