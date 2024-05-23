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
 
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormsRoutingModule } from '../forms/forms-routing.module';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ListeNotifComponent } from './liste-notif/liste-notif.component';


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
    NbAlertModule
    
  
  ],
  declarations: [
   ListeNotifComponent
       
  ],
})
export class NotifyModule { }