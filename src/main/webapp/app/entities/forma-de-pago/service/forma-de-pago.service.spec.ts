import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFormaDePago, FormaDePago } from '../forma-de-pago.model';

import { FormaDePagoService } from './forma-de-pago.service';

describe('FormaDePago Service', () => {
  let service: FormaDePagoService;
  let httpMock: HttpTestingController;
  let elemDefault: IFormaDePago;
  let expectedResult: IFormaDePago | IFormaDePago[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FormaDePagoService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      formaPago: 'AAAAAAA',
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

    it('should create a FormaDePago', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new FormaDePago()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FormaDePago', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          formaPago: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FormaDePago', () => {
      const patchObject = Object.assign({}, new FormaDePago());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FormaDePago', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          formaPago: 'BBBBBB',
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

    it('should delete a FormaDePago', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFormaDePagoToCollectionIfMissing', () => {
      it('should add a FormaDePago to an empty array', () => {
        const formaDePago: IFormaDePago = { id: 123 };
        expectedResult = service.addFormaDePagoToCollectionIfMissing([], formaDePago);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(formaDePago);
      });

      it('should not add a FormaDePago to an array that contains it', () => {
        const formaDePago: IFormaDePago = { id: 123 };
        const formaDePagoCollection: IFormaDePago[] = [
          {
            ...formaDePago,
          },
          { id: 456 },
        ];
        expectedResult = service.addFormaDePagoToCollectionIfMissing(formaDePagoCollection, formaDePago);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FormaDePago to an array that doesn't contain it", () => {
        const formaDePago: IFormaDePago = { id: 123 };
        const formaDePagoCollection: IFormaDePago[] = [{ id: 456 }];
        expectedResult = service.addFormaDePagoToCollectionIfMissing(formaDePagoCollection, formaDePago);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(formaDePago);
      });

      it('should add only unique FormaDePago to an array', () => {
        const formaDePagoArray: IFormaDePago[] = [{ id: 123 }, { id: 456 }, { id: 90410 }];
        const formaDePagoCollection: IFormaDePago[] = [{ id: 123 }];
        expectedResult = service.addFormaDePagoToCollectionIfMissing(formaDePagoCollection, ...formaDePagoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const formaDePago: IFormaDePago = { id: 123 };
        const formaDePago2: IFormaDePago = { id: 456 };
        expectedResult = service.addFormaDePagoToCollectionIfMissing([], formaDePago, formaDePago2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(formaDePago);
        expect(expectedResult).toContain(formaDePago2);
      });

      it('should accept null and undefined values', () => {
        const formaDePago: IFormaDePago = { id: 123 };
        expectedResult = service.addFormaDePagoToCollectionIfMissing([], null, formaDePago, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(formaDePago);
      });

      it('should return initial array if no FormaDePago is added', () => {
        const formaDePagoCollection: IFormaDePago[] = [{ id: 123 }];
        expectedResult = service.addFormaDePagoToCollectionIfMissing(formaDePagoCollection, undefined, null);
        expect(expectedResult).toEqual(formaDePagoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
