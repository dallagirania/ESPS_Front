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

import { VerifComponent } from './verif/verif.component';
import { OperateurRenderComponent } from './operateur-render/operateur-render.component';
import { ConformiteStyleComponent } from './conformite-style/conformite-style.component';


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
   
    VerifComponent,
    OperateurRenderComponent,
    ConformiteStyleComponent,
       
  ],
})
export class VerifModule { }