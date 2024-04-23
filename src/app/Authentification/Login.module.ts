import { CommonModule } from '@angular/common';
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
  NbToast,
  NbToastrModule,
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/LoginComponent';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsRoutingModule } from '../pages/forms/forms-routing.module';

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
    NbToastrModule.forRoot(),


  ],
  declarations: [
    LoginComponent

  ],
})
export class LoginModule {
}
