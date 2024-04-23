import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbActionsModule, NbButtonModule, NbCheckboxModule, NbDatepickerModule, NbDialogModule, NbIconModule, NbInputModule, NbMenuModule, NbRadioModule, NbRouteTabsetModule, NbSelectModule, NbUserModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardModule } from './../dashboard/dashboard.module';
import { ECommerceModule } from './../e-commerce/e-commerce.module';
import { PagesRoutingModule } from './../pages-routing.module';
import { MiscellaneousModule } from './../miscellaneous/miscellaneous.module';
import { ParametageSiteComponent } from './../Parametrages/parametage-site/parametage-site.component';

import { NbCardModule, NbTabsetModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ParametageRUOComponent } from './parametage-ruo/parametage-ruo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsRoutingModule } from '../forms/forms-routing.module';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbDialogModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    NbTabsetModule,
    NbCardModule,
    Ng2SmartTableModule,
    NbTabsetModule,
    ReactiveFormsModule,
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    FormsRoutingModule,
    NbSelectModule,
    NbIconModule,
    Ng2SmartTableModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NgMultiSelectDropDownModule
    
 
    

    

  ],
  declarations: [
    ParametageSiteComponent,
    ParametageRUOComponent,

  ],
})
export class ParametragesModule {
}
