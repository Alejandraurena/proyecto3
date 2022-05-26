import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VisitanteComponent } from './list/visitante.component';
import { VisitanteDetailComponent } from './detail/visitante-detail.component';
import { VisitanteUpdateComponent } from './update/visitante-update.component';
import { VisitanteDeleteDialogComponent } from './delete/visitante-delete-dialog.component';
import { VisitanteRoutingModule } from './route/visitante-routing.module';

@NgModule({
  imports: [SharedModule, VisitanteRoutingModule],
  declarations: [VisitanteComponent, VisitanteDetailComponent, VisitanteUpdateComponent, VisitanteDeleteDialogComponent],
  entryComponents: [VisitanteDeleteDialogComponent],
})
export class VisitanteModule {}
