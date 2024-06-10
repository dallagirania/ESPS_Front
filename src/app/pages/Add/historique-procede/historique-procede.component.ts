import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { DownloadButtonComponent } from '../download-button/download-button.component';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { ModProcede } from '../../../Model/ModProcede.model';
import { CrudService } from '../../../Service/crud.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { DownloadFilesComponent } from '../download-files/download-files.component';
import { Procede } from '../../../Model/Procede.model';

@Component({
  selector: 'ngx-historique-procede',
  templateUrl: './historique-procede.component.html',
  styleUrls: ['./historique-procede.component.scss']
})
export class HistoriqueProcedeComponent implements OnInit, ViewCell {
  SettingsHistorique= {

    noDataMessage: 'L\'Historique du PS est vide',
  
    mode: "external",
  
    actions: {
      add:false,
      edit: false,
      delete: false,
      position: 'right',
  
  
  
    },
    pager: {
      display: true,
      perPage: 3,
    },
   columns: {
  
    date_init: {
  
        title: 'Date Debut',
  
        type: 'string',
  
      },
      date_fin: {
  
        title: 'Date Fin',
  
        type: 'string',
  
      },
      id: {
        title: 'Fiches Procédés Spéciaux',
        type: 'custom',
        renderComponent: DownloadFilesComponent, // Composant personnalisé pour afficher l'icône de téléchargement
      },
    }
  }
  
  renderValue: number;

  @Input() value: number;

  @Input() rowData: any;
   id:any

   Historique:ModProcede[]=[]
   ProcedeActuelle= new Procede()
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
   this.service.getProcedeById(this.value).subscribe(liste => {
    this.ProcedeActuelle=liste;
    this.service.getModProcedeByProcedeId(this.value).subscribe(liste => {
      this.Historique=liste;
      this.Historique.push(this.ProcedeActuelle);
      this.Historique.sort((a, b) => {
        return new Date(b.date_init.toString()).getTime() - new Date(a.date_init.toString()).getTime();
      });
      this.sourceHistorique = new LocalDataSource(this.Historique) 
    
    });
  });
    
  }
  historique(dialog: TemplateRef<any>) {
    this.dialogservice.open(dialog);
  }




}

