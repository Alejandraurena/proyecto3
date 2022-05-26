import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFormaDePago, FormaDePago } from '../forma-de-pago.model';
import { FormaDePagoService } from '../service/forma-de-pago.service';

@Injectable({ providedIn: 'root' })
export class FormaDePagoRoutingResolveService implements Resolve<IFormaDePago> {
  constructor(protected service: FormaDePagoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFormaDePago> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((formaDePago: HttpResponse<FormaDePago>) => {
          if (formaDePago.body) {
            return of(formaDePago.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FormaDePago());
  }
}
