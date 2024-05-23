import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../Service/crud.service';
import { NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';
import { CarteControle } from '../../../Model/CarteControle.model';
import { Subscription } from 'rxjs';
import { ConformiteStyleComponent } from '../../Controle/conformite-style/conformite-style.component';
import { OperateurRenderComponent } from '../../Controle/operateur-render/operateur-render.component';
import { MesureCC } from '../../../Model/MesureCC.model';
import { LocalDataSource } from 'ng2-smart-table';

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
    //  position: 'right',
  
    },
   
    pager: {
      display: true,
      perPage: 3, // Limiter le nombre de lignes par page à 5
    },
    columns: {
     date: {
       title: 'Date',
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
        //  console.log("Valeur de etatvalide :", row.etatvalide);
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
    console.log("id okd envoyer est : =>",this.id)
    this.LoadMesureByCC(this.id)
  }
  LoadMesureByCC(id:number){
    this.service.getMesureCCByCarteId(id).subscribe(mesure=>{
    this.listemesureCC=mesure.reverse();
    console.log(this.listemesureCC)
    this.sourceMesureCC = new LocalDataSource(this.listemesureCC) 
    })
    }
}
