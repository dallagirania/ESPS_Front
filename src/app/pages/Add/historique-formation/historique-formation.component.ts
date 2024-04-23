import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { CrudService } from '../../../Service/crud.service';
import { FormBuilder } from '@angular/forms';
import { ModFormation } from '../../../Model/ModFormation.model';
import { DownloadButtonComponent } from '../download-button/download-button.component';
import { Formation } from '../../../Model/Formation.model';

@Component({
  selector: 'ngx-historique-formation',
  templateUrl: './historique-formation.component.html',
  styleUrls: ['./historique-formation.component.scss']
})
export class HistoriqueFormationComponent implements OnInit, ViewCell {
  SettingsHistorique= {

    noDataMessage: 'L\'Historique d\'habilitation est vide',
  
    mode: "external",
  
    actions: {
      add:false,
      edit: false,
      delete: false,
      position: 'right',
  
  
  
    },  
   columns: {
  
    date_init: {
  
        title: 'Date Habilitation',
  
        type: 'string',
  
      },
      date_fin: {
  
        title: 'Date Fin Habilitation',
  
        type: 'string',
  
      },
      id: {
        title: 'Fichier d\'Habilitataion',
        type: 'custom',
        renderComponent: DownloadButtonComponent, // Composant personnalisé pour afficher l'icône de téléchargement
      },
    }
  }
  
  renderValue: string;

  @Input() value: string;

  @Input() rowData: any;
   id:any

   Historique:ModFormation[]=[]
   formationActuelle:Formation=new Formation()
   sourceHistorique: LocalDataSource = new LocalDataSource();
  constructor(
    private service: CrudService,
     private router: Router,
     private fb: FormBuilder,
     private dialogservice: NbDialogService,
     private toastrService: NbToastrService,
     private rout:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.renderValue = this.value;
   console.log("====> " + this.value );
   this.service.getFormationById(parseInt(this.value)).subscribe(liste => {
    console.log("test");
    this.formationActuelle=liste;
    console.log(this.formationActuelle);
    this.service.getModFormationByFormationId(parseInt(this.value)).subscribe(liste => {
      console.log("test");
      this.Historique=liste.reverse();
      this.Historique.push(this.formationActuelle);
      this.sourceHistorique = new LocalDataSource(this.Historique) 
      console.log(this.Historique);
    });
  });
   
  
    
  }
  historique(dialog: TemplateRef<any>) {
    this.dialogservice.open(dialog);
  }




}
