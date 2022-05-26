import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITarifaPlana, TarifaPlana } from '../tarifa-plana.model';
import { TarifaPlanaService } from '../service/tarifa-plana.service';

@Injectable({ providedIn: 'root' })
export class TarifaPlanaRoutingResolveService implements Resolve<ITarifaPlana> {
  constructor(protected service: TarifaPlanaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITarifaPlana> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((tarifaPlana: HttpResponse<TarifaPlana>) => {
          if (tarifaPlana.body) {
            return of(tarifaPlana.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TarifaPlana());
  }
}
