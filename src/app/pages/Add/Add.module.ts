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
 
 
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { ChartModule } from 'angular2-chartjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormsRoutingModule } from '../forms/forms-routing.module';
import { AddProcedeComponent } from './add-procede/add-procede.component';
import { ProcedeComponent } from './procede/procede.component';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ProcedeDetailComponent } from './procede-detail/procede-detail.component';
import { ProcedeOKDComponent } from './procede-okd/procede-okd.component';
import { TestComponent } from './test/test.component';
import { EditProcedeComponent } from './edit-procede/edit-procede.component';
import { PontComponent } from './pont/pont.component';
import { ListeHabilitationComponent } from './liste-habilitation/liste-habilitation.component';
import { DownloadButtonComponent } from './download-button/download-button.component';
import { HistoriqueFormationComponent } from './historique-formation/historique-formation.component';
import { HistoriqueProcedeComponent } from './historique-procede/historique-procede.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DownloadFilesComponent } from './download-files/download-files.component';
import { ImprimerHabilitationComponent } from './imprimer-habilitation/imprimer-habilitation.component';
import { MesureCCComponent } from './mesure-cc/mesure-cc.component';
import { MesureOKDComponent } from './mesure-okd/mesure-okd.component';
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
    ChartModule
    
  
  ],
  declarations: [
   
    AddProcedeComponent,
    ProcedeComponent,
    ProcedeDetailComponent,
    ProcedeOKDComponent,
    TestComponent,
    EditProcedeComponent,
    PontComponent,
    ListeHabilitationComponent,
    DownloadButtonComponent,
    HistoriqueFormationComponent,
    HistoriqueProcedeComponent,
    DownloadFilesComponent,
    ImprimerHabilitationComponent,
    MesureCCComponent,
    MesureOKDComponent,
    CourbeCCComponent
    
  
  ],
})
export class AddModule { }
