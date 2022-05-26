import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VisitanteComponent } from '../list/visitante.component';
import { VisitanteDetailComponent } from '../detail/visitante-detail.component';
import { VisitanteUpdateComponent } from '../update/visitante-update.component';
import { VisitanteRoutingResolveService } from './visitante-routing-resolve.service';

const visitanteRoute: Routes = [
  {
    path: '',
    component: VisitanteComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VisitanteDetailComponent,
    resolve: {
      visitante: VisitanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VisitanteUpdateComponent,
    resolve: {
      visitante: VisitanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VisitanteUpdateComponent,
    resolve: {
      visitante: VisitanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(visitanteRoute)],
  exports: [RouterModule],
})
export class VisitanteRoutingModule {}
