import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
  NbStepperModule,
  NbAccordionModule,
  NbTabsetModule,
  NbRouteTabsetModule,
  NbAlertModule,
  NbProgressBarModule,
 
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormsRoutingModule } from '../forms/forms-routing.module';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ListeProcedeComponent } from './liste-procede/liste-procede.component';
import { DetailComponent } from './detail/detail.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MesureCCComponent } from './mesure-cc/mesure-cc.component';
import { MesureOKDComponent } from './mesure-okd/mesure-okd.component';
import { ChartModule } from 'angular2-chartjs';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CourbeCCComponent } from './courbe-cc/courbe-cc.component';




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
   
   ListeProcedeComponent,
   DetailComponent,
   MesureCCComponent,
   MesureOKDComponent,
   CourbeCCComponent
       
  ],
})
export class DetailModule { }