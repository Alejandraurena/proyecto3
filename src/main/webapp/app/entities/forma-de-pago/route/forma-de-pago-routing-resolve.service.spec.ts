import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IFormaDePago, FormaDePago } from '../forma-de-pago.model';
import { FormaDePagoService } from '../service/forma-de-pago.service';

import { FormaDePagoRoutingResolveService } from './forma-de-pago-routing-resolve.service';

describe('FormaDePago routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FormaDePagoRoutingResolveService;
  let service: FormaDePagoService;
  let resultFormaDePago: IFormaDePago | undefined;

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
    routingResolveService = TestBed.inject(FormaDePagoRoutingResolveService);
    service = TestBed.inject(FormaDePagoService);
    resultFormaDePago = undefined;
  });

  describe('resolve', () => {
    it('should return IFormaDePago returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFormaDePago = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFormaDePago).toEqual({ id: 123 });
    });

    it('should return new IFormaDePago if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFormaDePago = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFormaDePago).toEqual(new FormaDePago());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as FormaDePago })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFormaDePago = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFormaDePago).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
