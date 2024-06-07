import { Component, Input, OnInit } from '@angular/core';
import { ConformiteStyleComponent } from '../../Controle/conformite-style/conformite-style.component';
import { OperateurRenderComponent } from '../../Controle/operateur-render/operateur-render.component';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { CrudService } from '../../../Service/crud.service';
import { NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';
import { MesureOKD } from '../../../Model/MesureOKD.model';
import { filter } from 'rxjs-compat/operator/filter';

@Component({
  selector: 'ngx-mesure-okd',
  templateUrl: './mesure-okd.component.html',
  styleUrls: ['./mesure-okd.component.scss']
})
export class MesureOKDComponent implements OnInit {
  @Input() id: number;
  listemesureOKD: MesureOKD[]=[]
  SettingsMesureOKD = {

    noDataMessage: 'Liste des Mesures "OK DEMARRAGE" est vide',
  
    mode: "external",
  
    actions: {
      add:false,
      edit: false,
      delete: false,
    },
   
    pager: {
      display: true,
      perPage: 3, 
    },
   columns: {
    id: {
      title: 'Les Mesures',
      type: 'custom',
     // filter:false,
      renderComponent: OperateurRenderComponent
    },
     date_add: {
      title: 'Date Ajout',
      type: 'string',
    },
    etatactive: {
      title: 'Conformité',
      type: 'custom',
      valuePrepareFunction: (cell, row) => row.etatactive, // Utilisez row.id au lieu de cell.id
      renderComponent: ConformiteStyleComponent
      // valuePrepareFunction: (cell, row) => {
      //     console.log("Valeur de etatvalide :", row.etatactive);
      //     if (row.etatactive === false) {
      //         return "<p class='text-danger'style='background-color: #f8d7da; padding: 5px;'>Non Conforme</p>";
      //     } else {
      //         return "<p class='text-success'>Conforme</p>";
      //     }
      // },
  },
  
    etatvalide: {
      title: 'Validation',
      type: 'html',
      valuePrepareFunction: (cell, row) => {
      //    console.log("Valeur de etatvalide :", row.etatvalide);
          if (row.etatvalide === false) {
            return '<i class="fas fa-times-circle fa-2x text-danger" ></i>';
        } else {
            return '<i class="fas fa-check fa-2x text-success"></i>';
        }
      },
  },
      equipe: {
  
        title: 'Equipe',
  
        type: 'string',
  
      },
  
      evenement: {
  
        title: 'Evenement',
  
        type: 'string',
  
      },
      operateurMatricule: {
  
        title: 'Matricule Opérateur',
        type: 'string',
      },
    
      qualiticienMatricule: {
  
        title: 'Matricule Qualiticien',
        type: 'string',
      },   
    }
  }
  sourceMesureOKD :LocalDataSource = new LocalDataSource();
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private rout:ActivatedRoute,
    private service:CrudService,
    private dialogservice: NbDialogService,
    private toastrService: NbToastrService,
    private theme: NbThemeService,
    private layoutService: LayoutService,
  ) { }

  ngOnInit(): void {
    this.LoadMesureByOKD(this.id)
  }
  LoadMesureByOKD(id:number){
    this.service.getMesureOKDByOKDId(id).subscribe(mesure=>{
    this.listemesureOKD=mesure.reverse();
    this.sourceMesureOKD = new LocalDataSource(this.listemesureOKD) 
    })
    }
}
