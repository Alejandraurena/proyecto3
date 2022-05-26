import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITipoVehiculo, TipoVehiculo } from '../tipo-vehiculo.model';

import { TipoVehiculoService } from './tipo-vehiculo.service';

describe('TipoVehiculo Service', () => {
  let service: TipoVehiculoService;
  let httpMock: HttpTestingController;
  let elemDefault: ITipoVehiculo;
  let expectedResult: ITipoVehiculo | ITipoVehiculo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TipoVehiculoService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      tipoVehiculo: 'AAAAAAA',
      marcaVehiculo: 'AAAAAAA',
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

    it('should create a TipoVehiculo', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TipoVehiculo()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TipoVehiculo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          tipoVehiculo: 'BBBBBB',
          marcaVehiculo: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TipoVehiculo', () => {
      const patchObject = Object.assign(
        {
          marcaVehiculo: 'BBBBBB',
        },
        new TipoVehiculo()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TipoVehiculo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          tipoVehiculo: 'BBBBBB',
          marcaVehiculo: 'BBBBBB',
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

    it('should delete a TipoVehiculo', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTipoVehiculoToCollectionIfMissing', () => {
      it('should add a TipoVehiculo to an empty array', () => {
        const tipoVehiculo: ITipoVehiculo = { id: 123 };
        expectedResult = service.addTipoVehiculoToCollectionIfMissing([], tipoVehiculo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tipoVehiculo);
      });

      it('should not add a TipoVehiculo to an array that contains it', () => {
        const tipoVehiculo: ITipoVehiculo = { id: 123 };
        const tipoVehiculoCollection: ITipoVehiculo[] = [
          {
            ...tipoVehiculo,
          },
          { id: 456 },
        ];
        expectedResult = service.addTipoVehiculoToCollectionIfMissing(tipoVehiculoCollection, tipoVehiculo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TipoVehiculo to an array that doesn't contain it", () => {
        const tipoVehiculo: ITipoVehiculo = { id: 123 };
        const tipoVehiculoCollection: ITipoVehiculo[] = [{ id: 456 }];
        expectedResult = service.addTipoVehiculoToCollectionIfMissing(tipoVehiculoCollection, tipoVehiculo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tipoVehiculo);
      });

      it('should add only unique TipoVehiculo to an array', () => {
        const tipoVehiculoArray: ITipoVehiculo[] = [{ id: 123 }, { id: 456 }, { id: 86823 }];
        const tipoVehiculoCollection: ITipoVehiculo[] = [{ id: 123 }];
        expectedResult = service.addTipoVehiculoToCollectionIfMissing(tipoVehiculoCollection, ...tipoVehiculoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tipoVehiculo: ITipoVehiculo = { id: 123 };
        const tipoVehiculo2: ITipoVehiculo = { id: 456 };
        expectedResult = service.addTipoVehiculoToCollectionIfMissing([], tipoVehiculo, tipoVehiculo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tipoVehiculo);
        expect(expectedResult).toContain(tipoVehiculo2);
      });

      it('should accept null and undefined values', () => {
        const tipoVehiculo: ITipoVehiculo = { id: 123 };
        expectedResult = service.addTipoVehiculoToCollectionIfMissing([], null, tipoVehiculo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tipoVehiculo);
      });

      it('should return initial array if no TipoVehiculo is added', () => {
        const tipoVehiculoCollection: ITipoVehiculo[] = [{ id: 123 }];
        expectedResult = service.addTipoVehiculoToCollectionIfMissing(tipoVehiculoCollection, undefined, null);
        expect(expectedResult).toEqual(tipoVehiculoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
