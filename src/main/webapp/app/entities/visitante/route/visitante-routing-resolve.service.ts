import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVisitante, Visitante } from '../visitante.model';
import { VisitanteService } from '../service/visitante.service';

@Injectable({ providedIn: 'root' })
export class VisitanteRoutingResolveService implements Resolve<IVisitante> {
  constructor(protected service: VisitanteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVisitante> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((visitante: HttpResponse<Visitante>) => {
          if (visitante.body) {
            return of(visitante.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Visitante());
  }
}
