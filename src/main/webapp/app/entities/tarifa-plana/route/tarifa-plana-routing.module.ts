import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TarifaPlanaComponent } from '../list/tarifa-plana.component';
import { TarifaPlanaDetailComponent } from '../detail/tarifa-plana-detail.component';
import { TarifaPlanaUpdateComponent } from '../update/tarifa-plana-update.component';
import { TarifaPlanaRoutingResolveService } from './tarifa-plana-routing-resolve.service';

const tarifaPlanaRoute: Routes = [
  {
    path: '',
    component: TarifaPlanaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TarifaPlanaDetailComponent,
    resolve: {
      tarifaPlana: TarifaPlanaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TarifaPlanaUpdateComponent,
    resolve: {
      tarifaPlana: TarifaPlanaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TarifaPlanaUpdateComponent,
    resolve: {
      tarifaPlana: TarifaPlanaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(tarifaPlanaRoute)],
  exports: [RouterModule],
})
export class TarifaPlanaRoutingModule {}
