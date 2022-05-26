import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ITarifaPlana, TarifaPlana } from '../tarifa-plana.model';
import { TarifaPlanaService } from '../service/tarifa-plana.service';

import { TarifaPlanaRoutingResolveService } from './tarifa-plana-routing-resolve.service';

describe('TarifaPlana routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: TarifaPlanaRoutingResolveService;
  let service: TarifaPlanaService;
  let resultTarifaPlana: ITarifaPlana | undefined;

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
    routingResolveService = TestBed.inject(TarifaPlanaRoutingResolveService);
    service = TestBed.inject(TarifaPlanaService);
    resultTarifaPlana = undefined;
  });

  describe('resolve', () => {
    it('should return ITarifaPlana returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTarifaPlana = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTarifaPlana).toEqual({ id: 123 });
    });

    it('should return new ITarifaPlana if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTarifaPlana = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTarifaPlana).toEqual(new TarifaPlana());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TarifaPlana })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTarifaPlana = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTarifaPlana).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
