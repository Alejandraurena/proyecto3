import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ITipoVehiculo, TipoVehiculo } from '../tipo-vehiculo.model';
import { TipoVehiculoService } from '../service/tipo-vehiculo.service';

import { TipoVehiculoRoutingResolveService } from './tipo-vehiculo-routing-resolve.service';

describe('TipoVehiculo routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TipoVehiculoRoutingResolveService;
  let service: TipoVehiculoService;
  let resultTipoVehiculo: ITipoVehiculo | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(TipoVehiculoRoutingResolveService);
    service = TestBed.inject(TipoVehiculoService);
    resultTipoVehiculo = undefined;
  });

  describe('resolve', () => {
    it('should return ITipoVehiculo returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTipoVehiculo = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTipoVehiculo).toEqual({ id: 123 });
    });

    it('should return new ITipoVehiculo if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTipoVehiculo = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTipoVehiculo).toEqual(new TipoVehiculo());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TipoVehiculo })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTipoVehiculo = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTipoVehiculo).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
