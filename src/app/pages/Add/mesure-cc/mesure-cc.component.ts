import { Component, Input, OnInit } from '@angular/core';
import { MesureCC } from '../../../Model/MesureCC.model';
import { ConformiteStyleComponent } from '../../Controle/conformite-style/conformite-style.component';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { CrudService } from '../../../Service/crud.service';
import { NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';

@Component({
  selector: 'ngx-mesure-cc',
  templateUrl: './mesure-cc.component.html',
  styleUrls: ['./mesure-cc.component.scss']
})
export class MesureCCComponent implements OnInit {
  @Input() id: number;
  listemesureCC: MesureCC[]=[]
  SettingsMesure = {
    noDataMessage: 'Liste des Mesures Cartes de Controlles est vide',
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
     date: {
       title: 'Date',
       type: 'string',
     },
     etatactive: {
      title: 'Conformité',
      type: 'custom',
      valuePrepareFunction: (cell, row) => row.etatactive,
      renderComponent: ConformiteStyleComponent
  },
    etatvalide: {
      title: 'Validation',
      type: 'html',
      valuePrepareFunction: (cell, row) => {
          if (row.etatvalide === false) {
            return '<i class="fas fa-times-circle fa-2x text-danger" ></i>';
        } else {
            return '<i class="fas fa-check fa-2x text-success"></i>';
        }
      },
  },
     operateurMatricule: {

      title: 'Matricule Opérateur',
      type: 'string',
    },
   
     val: {
       title: 'Valeurs',
       type: 'array',
     },
     resultat: {
       title: 'Résultat',
       type: 'string',
     },
  
    qualiticienMatricule: {

      title: 'Matricule Qualiticien',
      type: 'string',
    },
  
   },
  }

  sourceMesureCC :LocalDataSource = new LocalDataSource();
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
   
    this.LoadMesureByCC(this.id)
  }
  LoadMesureByCC(id:number){
    this.service.getMesureCCByCarteId(id).subscribe(mesure=>{
    this.listemesureCC=mesure.reverse();
    this.sourceMesureCC = new LocalDataSource(this.listemesureCC) 
    })
    }
}
