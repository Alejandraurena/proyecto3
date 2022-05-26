import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'empleado',
        data: { pageTitle: 'easyparkingApp.empleado.home.title' },
        loadChildren: () => import('./empleado/empleado.module').then(m => m.EmpleadoModule),
      },
      {
        path: 'cliente',
        data: { pageTitle: 'easyparkingApp.cliente.home.title' },
        loadChildren: () => import('./cliente/cliente.module').then(m => m.ClienteModule),
      },
      {
        path: 'visitante',
        data: { pageTitle: 'easyparkingApp.visitante.home.title' },
        loadChildren: () => import('./visitante/visitante.module').then(m => m.VisitanteModule),
      },
      {
        path: 'forma-de-pago',
        data: { pageTitle: 'easyparkingApp.formaDePago.home.title' },
        loadChildren: () => import('./forma-de-pago/forma-de-pago.module').then(m => m.FormaDePagoModule),
      },
      {
        path: 'facturacion',
        data: { pageTitle: 'easyparkingApp.facturacion.home.title' },
        loadChildren: () => import('./facturacion/facturacion.module').then(m => m.FacturacionModule),
      },
      {
        path: 'tipo-vehiculo',
        data: { pageTitle: 'easyparkingApp.tipoVehiculo.home.title' },
        loadChildren: () => import('./tipo-vehiculo/tipo-vehiculo.module').then(m => m.TipoVehiculoModule),
      },
      {
        path: 'vehiculo',
        data: { pageTitle: 'easyparkingApp.vehiculo.home.title' },
        loadChildren: () => import('./vehiculo/vehiculo.module').then(m => m.VehiculoModule),
      },
      {
        path: 'registro',
        data: { pageTitle: 'easyparkingApp.registro.home.title' },
        loadChildren: () => import('./registro/registro.module').then(m => m.RegistroModule),
      },
      {
        path: 'tarifa-plana',
        data: { pageTitle: 'easyparkingApp.tarifaPlana.home.title' },
        loadChildren: () => import('./tarifa-plana/tarifa-plana.module').then(m => m.TarifaPlanaModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
