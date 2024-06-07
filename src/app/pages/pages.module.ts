import { NgModule } from '@angular/core';
import { NbMenuModule, NbToastrModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ParametragesModule } from './Parametrages/Parametrages.module';
import { AddModule } from './Add/Add.module';
import { VerifModule } from './Controle/Controle.module';
import { DetailModule } from './ProcedeDetail/Details.module';
import { NotifyModule } from './ListeNotifications/Notify.module';
import { HomeComponent } from './Visiteur/home/home.component';
import { HomeModule } from './Visiteur/Home.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    ParametragesModule,
    AddModule,
    VerifModule,
    DetailModule,
    NotifyModule,
    HomeModule

  ],
  declarations: [
    PagesComponent,
  
    
  ],
})
export class PagesModule {
}
