import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IFacturacion, Facturacion } from '../facturacion.model';

import { FacturacionService } from './facturacion.service';

describe('Facturacion Service', () => {
  let service: FacturacionService;
  let httpMock: HttpTestingController;
  let elemDefault: IFacturacion;
  let expectedResult: IFacturacion | IFacturacion[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FacturacionService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      fechaFactura: currentDate,
      valorFactura: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          fechaFactura: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Facturacion', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          fechaFactura: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaFactura: currentDate,
        },
        returnedFromService
      );

      service.create(new Facturacion()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Facturacion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fechaFactura: currentDate.format(DATE_FORMAT),
          valorFactura: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaFactura: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Facturacion', () => {
      const patchObject = Object.assign(
        {
          valorFactura: 1,
        },
        new Facturacion()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          fechaFactura: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Facturacion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fechaFactura: currentDate.format(DATE_FORMAT),
          valorFactura: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fechaFactura: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Facturacion', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFacturacionToCollectionIfMissing', () => {
      it('should add a Facturacion to an empty array', () => {
        const facturacion: IFacturacion = { id: 123 };
        expectedResult = service.addFacturacionToCollectionIfMissing([], facturacion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(facturacion);
      });

      it('should not add a Facturacion to an array that contains it', () => {
        const facturacion: IFacturacion = { id: 123 };
        const facturacionCollection: IFacturacion[] = [
          {
            ...facturacion,
          },
          { id: 456 },
        ];
        expectedResult = service.addFacturacionToCollectionIfMissing(facturacionCollection, facturacion);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Facturacion to an array that doesn't contain it", () => {
        const facturacion: IFacturacion = { id: 123 };
        const facturacionCollection: IFacturacion[] = [{ id: 456 }];
        expectedResult = service.addFacturacionToCollectionIfMissing(facturacionCollection, facturacion);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(facturacion);
      });

      it('should add only unique Facturacion to an array', () => {
        const facturacionArray: IFacturacion[] = [{ id: 123 }, { id: 456 }, { id: 17504 }];
        const facturacionCollection: IFacturacion[] = [{ id: 123 }];
        expectedResult = service.addFacturacionToCollectionIfMissing(facturacionCollection, ...facturacionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const facturacion: IFacturacion = { id: 123 };
        const facturacion2: IFacturacion = { id: 456 };
        expectedResult = service.addFacturacionToCollectionIfMissing([], facturacion, facturacion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(facturacion);
        expect(expectedResult).toContain(facturacion2);
      });

      it('should accept null and undefined values', () => {
        const facturacion: IFacturacion = { id: 123 };
        expectedResult = service.addFacturacionToCollectionIfMissing([], null, facturacion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(facturacion);
      });

      it('should return initial array if no Facturacion is added', () => {
        const facturacionCollection: IFacturacion[] = [{ id: 123 }];
        expectedResult = service.addFacturacionToCollectionIfMissing(facturacionCollection, undefined, null);
        expect(expectedResult).toEqual(facturacionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
