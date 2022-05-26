import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RegistroComponent } from '../list/registro.component';
import { RegistroDetailComponent } from '../detail/registro-detail.component';
import { RegistroUpdateComponent } from '../update/registro-update.component';
import { RegistroRoutingResolveService } from './registro-routing-resolve.service';

const registroRoute: Routes = [
  {
    path: '',
    component: RegistroComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RegistroDetailComponent,
    resolve: {
      registro: RegistroRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RegistroUpdateComponent,
    resolve: {
      registro: RegistroRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RegistroUpdateComponent,
    resolve: {
      registro: RegistroRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(registroRoute)],
  exports: [RouterModule],
})
export class RegistroRoutingModule {}
