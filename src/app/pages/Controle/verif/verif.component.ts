import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../../Service/crud.service';
import { NbToastrService } from '@nebular/theme';
import { MesureCC } from '../../../Model/MesureCC.model';
import { Utilisateur } from '../../../Model/Utilisateur.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarteControle } from '../../../Model/CarteControle.model';

@Component({
  selector: 'ngx-verif',
  templateUrl: './verif.component.html',
  styleUrls: ['./verif.component.scss']
})
export class VerifComponent implements OnInit {
   //Declaration SettingsMesure
   SettingsMesure = {
   noDataMessage: 'Liste des Mesures Cartes de Controlles est vide',
   mode: "external",
   actions: {
     add:false,
     edit: true,
     delete: false,
     position: 'right',
 
   },
  
   edit: {
 
     editButtonContent: '<i class="nb-compose"></i>',
     saveButtonContent: '<i class="nb-checkmark"></i>',
     cancelButtonContent: '<i class="nb-close"></i>',
 
     confirmSave: true,
 
   }, 
   pager: {
     display: true,
     perPage: 5, // Limiter le nombre de lignes par page à 5
   },
   columns: {
    date: {
      title: 'Date',
      type: 'string',
    },
    motif_saisie: {
      title: 'Motif Saisie',
      type: 'string',
    },
    operateur: {
      title: 'Opérateur',
      type: 'string',
      // valuePrepareFunction: (cell, row) => {
      //   console.log(row.operateur)
      //   const operat =this.getOperateurById(row.operateur);
      //   return operat
      // },
    },
    carte: {
      title: 'Carte Controlle',
      valuePrepareFunction: (carte) => { return (carte?.nom); },
          filterFunction: (carte, val) => {
            if (carte != null) {
              const activiteNomLowerCase = carte.nom.toLowerCase();
              const valLowerCase = val.toLowerCase();
              return activiteNomLowerCase.indexOf(valLowerCase) !== -1 || !val;
            }
            return false;
          }
    },
    min: {
      title: 'Valeur Min',
      type: 'string',
      valuePrepareFunction: (cell, row) => {
        console.log(row.carte.id)
        const operat =this.getMinCarteById(row.carte.id);
        console.log(operat)
        return operat
      },
    },
    max: {
      title: 'Valeur Max',
      type: 'string',
      valuePrepareFunction: (cell, row) => {
        console.log(row.carte.id)
       const operat =this.getMaxCarteById(row.carte.id);
        return operat
      },
    },
   
    val: {
      title: 'Valeurs',
      type: 'array',
    },
    resultat: {
      title: 'Résultat',
      type: 'string',
    },
    commentaire: {
      title: 'Commentaire',
      type: 'string',
    },
    qualiticien: {
      title: 'Qualiticien',
     
    },
  },
 }
 listeMesure:MesureCC[]=[]
 utilisateur =new Utilisateur()
 carte= new CarteControle()
 sourceMesure: LocalDataSource = new LocalDataSource();
  constructor(
    private service:CrudService,
    private route:Router,
    private toastrService: NbToastrService
  ) { }

  ngOnInit(): void {
    this.service.getMesureCC().subscribe(mesure=>{
      this.listeMesure=mesure.reverse()
       console.log(mesure)
       this.sourceMesure.load(mesure);
     })
  }
//   getOperateurById(id:number): string {
//     this.service.getUserById(id).subscribe(user=>{
//       this.utilisateur=user 
//      })
//      return  this.utilisateur?.username!.toString()+" "+this.utilisateur?.prenom!.toString();

// }
getMinCarteById(id:number): string {
  this.service.getCCById(id).subscribe(carte=>{
    this.carte=carte 
   })
   return  this.carte.min!.toString() 
}
getMaxCarteById(id:number): string {
  this.service.getCCById(id).subscribe(carte=>{
    this.carte=carte  
   })
   return  this.carte.max!.toString()  
}

}
