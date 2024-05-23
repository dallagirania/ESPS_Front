import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { ParametageSiteComponent } from './Parametrages/parametage-site/parametage-site.component';
import { ParametageRUOComponent } from './Parametrages/parametage-ruo/parametage-ruo.component';
import { AddProcedeComponent } from './Add/add-procede/add-procede.component';
import { ProcedeComponent } from './Add/procede/procede.component';
import { ProcedeOKDComponent } from './Add/procede-okd/procede-okd.component';
import { EditProcedeComponent } from './Add/edit-procede/edit-procede.component';
import { ProcedeDetailComponent } from './Add/procede-detail/procede-detail.component';
import { PontComponent } from './Add/pont/pont.component';
import { ListeHabilitationComponent } from './Add/liste-habilitation/liste-habilitation.component';
import { TestComponent } from './Add/test/test.component';
import { VerifComponent } from './Controle/verif/verif.component';
import { ShowDataComponent } from './e-commerce/show-data/show-data.component';
import { ListeProcedeComponent } from './ProcedeDetail/liste-procede/liste-procede.component';
import { DetailComponent } from './ProcedeDetail/detail/detail.component';
import { ListeNotifComponent } from './ListeNotifications/liste-notif/liste-notif.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      //test
      path: 'test/:id',
      component: TestComponent,
    },
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },

    {
      path: 'ParametrageSite',
      component: ParametageSiteComponent,
    },
    {
      path: 'ParametrageRUO',
      component: ParametageRUOComponent,
    },
   
    {
      path: 'AddProcede',
      component: AddProcedeComponent,
    },
    {
      path: 'ListProcede',
      component: ProcedeComponent,
    },
    {
      path: 'ListeProcede',
      component: ListeProcedeComponent,
    },
    {
      path: 'Detail/:id',
      component: DetailComponent,
    },
    {
      path: 'ProcedeOKD',
      component: ProcedeOKDComponent,
    },

    {
      path: 'EditProcede/:id',
      component: EditProcedeComponent,
    },
    {
      path: 'DetailProcede/:id',
      component: ProcedeDetailComponent,
    },
    {
      path: 'ListeHabilitation',
      component: ListeHabilitationComponent,
    },
    {
      path: 'Pont',
      component: PontComponent,
    },

    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
    {
      path: 'Verif',
      component: VerifComponent,
    },
    {
      path: 'notify',
      component: ListeNotifComponent,
    },
/*     {
      path: 'show',
      component: ShowDataComponent,
    }, */
    {
      path: 'layout',
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
    {
      path: 'forms',
      loadChildren: () => import('./forms/forms.module')
        .then(m => m.FormsModule),
    },
    {
      path: 'ui-features',
      loadChildren: () => import('./ui-features/ui-features.module')
        .then(m => m.UiFeaturesModule),
    },
    {
      path: 'modal-overlays',
      loadChildren: () => import('./modal-overlays/modal-overlays.module')
        .then(m => m.ModalOverlaysModule),
    },
    {
      path: 'extra-components',
      loadChildren: () => import('./extra-components/extra-components.module')
        .then(m => m.ExtraComponentsModule),
    },
    {
      path: 'maps',
      loadChildren: () => import('./maps/maps.module')
        .then(m => m.MapsModule),
    },
    {
      path: 'charts',
      loadChildren: () => import('./charts/charts.module')
        .then(m => m.ChartsModule),
    },
    {
      path: 'editors',
      loadChildren: () => import('./editors/editors.module')
        .then(m => m.EditorsModule),
    },
    {
      path: 'tables',
      loadChildren: () => import('./tables/tables.module')
        .then(m => m.TablesModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
