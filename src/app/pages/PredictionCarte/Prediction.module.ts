import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbAccordionModule, NbActionsModule, NbAlertModule, NbButtonModule, NbCheckboxModule, NbDatepickerModule, NbDialogModule, NbIconModule, NbInputModule, NbMenuModule, NbProgressBarModule, NbRadioModule, NbRouteTabsetModule, NbSelectModule, NbStepperModule, NbUserModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { NbCardModule, NbTabsetModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsRoutingModule } from '../forms/forms-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartModule } from 'angular2-chartjs';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { PredictionComponent } from './prediction/prediction.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbProgressBarModule,
    NbDatepickerModule,
    FormsRoutingModule,
    NbSelectModule,
    NbIconModule,
    NbStepperModule,
    Ng2SmartTableModule,
    NbAccordionModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NgMultiSelectDropDownModule,
    NbAlertModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    ChartModule,
    NgxEchartsModule,
    NgxChartsModule,
    
 
    

    

  ],
  declarations: [
    PredictionComponent
  ],
})
export class PredictionModule {
}
