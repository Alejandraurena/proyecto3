import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RegistroComponent } from './list/registro.component';
import { RegistroDetailComponent } from './detail/registro-detail.component';
import { RegistroUpdateComponent } from './update/registro-update.component';
import { RegistroDeleteDialogComponent } from './delete/registro-delete-dialog.component';
import { RegistroRoutingModule } from './route/registro-routing.module';

@NgModule({
  imports: [SharedModule, RegistroRoutingModule],
  declarations: [RegistroComponent, RegistroDetailComponent, RegistroUpdateComponent, RegistroDeleteDialogComponent],
  entryComponents: [RegistroDeleteDialogComponent],
})
export class RegistroModule {}
