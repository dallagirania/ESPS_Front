import { Component, OnInit, TemplateRef } from '@angular/core';
import { CrudService } from '../../../Service/crud.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { Procede } from '../../../Model/Procede.model';
import { Critere } from '../../../Model/Critere.model';
import { OKD } from '../../../Model/OKD.model';
import { Formation } from '../../../Model/Formation.model';
import { CarteControle } from '../../../Model/CarteControle.model';
import { Habilitation } from '../../../Model/Habilitation.model';
import { saveAs } from 'file-saver';
import { MesureCC } from '../../../Model/MesureCC.model';
import * as XLSX from 'xlsx';
import { MesureOKD } from '../../../Model/MesureOKD.model';;
import { forkJoin, of,Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Component({
  selector: 'ngx-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  settingFormation = {
    noDataMessage: 'Liste des habilitations est vide',

    mode: "external",
  
    actions: {
      add: false,
      edit: false,
      delete: false,  
    //  position: 'right',
    },
   
    pager: {
      display: true,
    },
    columns: {
      utilisateur: {
        title: 'Collaborateur',
  
          type: 'string',
          valuePrepareFunction: (utilisateur) => { return (utilisateur?.username); },
          filterFunction: (utilisateur, val) => {
            if (utilisateur != null) {
              const activiteNomLowerCase = utilisateur.username.toLowerCase();
              const valLowerCase = val.toLowerCase();
              return activiteNomLowerCase.indexOf(valLowerCase) !== -1 || !val;
            }
            return false;
          }
      },
    
    
      date_init: {
        title: 'Date Formation',
        type: 'string',
      },
      date_fin: {
        title: 'Date Fin Formation',
        type: 'string',
      },
   
    
     
    },
  };


  listemesureOKD: MesureOKD[]=[]
  source: LocalDataSource = new LocalDataSource();
  sourceCarte: LocalDataSource = new LocalDataSource();
  sourceCritere: LocalDataSource = new LocalDataSource();
  idP:any; 
  currentProcede= new Procede()
  
  critere= new Critere()
  carte=new CarteControle()
  listeOKD:OKD[]=[]
  listeMesure:MesureCC[]=[]
  listeFormation:Formation[]=[]
  listeCarte:CarteControle[]=[]
  listeHabilitation:Habilitation[]=[]
  ListeCriteres:Critere[]=[]

  listeOKDAvecCriteres = [];

  renderValue: string;
  estQualifie: boolean
  imageUrl: string;
  etatQualif:string;
  activeProgress:number
  constructor(
    private dialogservice: NbDialogService,
    private service: CrudService,
    private router: Router,
    private fb: FormBuilder,
    private toastrService: NbToastrService,
    private rout:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.idP=this.rout.snapshot.params["id"];
    this.detail(this.idP)
 
    //bar de progression 


  }

  detail(id:number) {
   
    this.service.getProcedeByDernierDate(id).subscribe(procede => {
      this.currentProcede = procede;
      console.log("le procede actuel est ",procede)
      for(let file of this.currentProcede.files){
        if(file.nom.endsWith('.png') || file.nom.endsWith('.jpg')){
   //       console.log(file.nom)
          this.service.getImage(file.nom.toString())
          .subscribe(data => {
            // console.log(data)
            this.imageUrl=data
          }, error => {
            console.error('Erreur lors de la récupération de l\'image : ', error);
          });
        }
      }
      /*****************   Verification de qualification du PS ****************** */
      const dateFinProc = new Date(this.currentProcede.date_fin);
  //    console.log(this.currentProcede.date_fin)
      const dateSysteme = new Date();
  //    console.log(dateSysteme)
      const troisMoisApres = new Date();
      troisMoisApres.setMonth(dateSysteme.getMonth() + 3);
   //   console.log(troisMoisApres)
      this.etatQualif
      if (dateFinProc > troisMoisApres) {
        this.etatQualif='Qualifié';
      }else if(dateFinProc < dateSysteme){
        this.etatQualif='Non Qualifié';
      }
       else {
        this.etatQualif='A Requalifié';
      }
    });
    
  this.service.getOKDByProcedeId(id).subscribe(okds => {
    this.listeOKDAvecCriteres = okds.map(okd => ({
      okd,
      crits: null
    }));
   this.listeOKDAvecCriteres.forEach(okdAvecCrits => {
      this.service.getCritereByOkdId(okdAvecCrits.okd.id).subscribe(criteres => {
        okdAvecCrits.crits = criteres;
  
      });
    });
});

this.service.getCarteByProcedeId(id).subscribe(carte => {
this.listeCarte = carte;
this.sourceCarte = new LocalDataSource(this.listeCarte) 
//console.log("la liste des okds actuel est ",carte)
});

this.service.getHabilitationByProcedeId(id).subscribe(carte => {
this.listeHabilitation = carte;
this.sourceCritere = new LocalDataSource(this.listeHabilitation) 

for(let h of this.listeHabilitation ){
  this.service.getFormationByDernierDate(h.id).subscribe(liste => {
    this.listeFormation=liste;
    this.source = new LocalDataSource(this.listeFormation);
  
  });
}
});
  }



  download(id:number){
    this.service.getProcedeByDernierDate(id).subscribe(procede => {
      this.currentProcede = procede;
      for(let file of this.currentProcede.files )
        {
         if(file.nom.endsWith('.pdf') || file.nom.endsWith('.doc')){
           this.service.download(file.nom).subscribe(res => {
             saveAs(res, "Procede_Spéciale" +file.nom);
           });
         }
         
        }
    })
   }
// Méthode pour vérifier si l'image doit être affichée
hasImageToDisplay(): boolean {
  if (this.currentProcede && this.currentProcede.files && this.currentProcede.files.length > 0) {
    for (let file of this.currentProcede.files) {
      if (this.isImageFile(file.nom.toString())) {
        return true;
      }
    }
  }
  return false;
}

// Méthode pour vérifier si le nom du fichier se termine par une extension d'image
isImageFile(fileName: string): boolean {
  return fileName.endsWith('.png') || fileName.endsWith('.jpg');
}

/*********************************  Progressive Bar  Qualification PS  ************************************** */

getProgressBarWidth(date_fin: string): string {
   // Calculate and return the width of the progress bar based on the qualification status
  const dateFinProc = new Date(date_fin);
    //  console.log("date fin est : ",date_fin)
      const dateSysteme = new Date();
    //  console.log(dateSysteme)
      const troisMoisApres = new Date();
      troisMoisApres.setMonth(dateSysteme.getMonth() + 3);
    //  console.log(troisMoisApres)
      this.etatQualif
      if (dateFinProc > troisMoisApres) {
        return '100%';
      }else if(dateFinProc < dateSysteme){
        return '100%';
      }
       else {
        return '30%';
      }
}



getProgressBarColor(date_fin: string): string {
 // Determine and return the color of the progress bar based on the qualification status
  const dateFinProc = new Date(date_fin);
   //   console.log("date fin est : ",date_fin)
      const dateSysteme = new Date();
    //  console.log(dateSysteme)
      const troisMoisApres = new Date();
      troisMoisApres.setMonth(dateSysteme.getMonth() + 3);
   //   console.log(troisMoisApres)
      this.etatQualif
      if (dateFinProc > troisMoisApres) {
        return 'green';
      }else if(dateFinProc < dateSysteme){
        return 'red';
      }
       else {
        return 'orange';
      }
 

    }
  
    isRedState(date_fin: string): string {
           const dateFinProc = new Date(date_fin);
           const dateSysteme = new Date();
           const troisMoisApres = new Date();
           troisMoisApres.setMonth(dateSysteme.getMonth() + 3);
           this.etatQualif
           if(dateFinProc < dateSysteme){
            return this.etatQualif='Non Qualifié';
          }
         }

    isGreenState(date_fin: string): string {
      const dateFinProc = new Date(date_fin);
      const dateSysteme = new Date();
      const troisMoisApres = new Date();
      troisMoisApres.setMonth(dateSysteme.getMonth() + 3);
      this.etatQualif
      if (dateFinProc > troisMoisApres) {
        return 'Qualifié';
      }

    }

    isYellowState(date_fin: string): string {
      const dateFinProc = new Date(date_fin);
      const dateSysteme = new Date();
      const troisMoisApres = new Date();
      troisMoisApres.setMonth(dateSysteme.getMonth() + 3);
      this.etatQualif
      if ((dateFinProc < troisMoisApres)&&(dateFinProc > dateSysteme)) {
        return 'A Requalifié';
     }

    }

    Mesure(dialog: TemplateRef<any>,id:number) {
        this.service.getCCById(id).subscribe(carte=>{
          this.carte=carte;
          this.dialogservice.open(dialog);
        })
    } 
    MesureOKD(dialog: TemplateRef<any>) {
        this.dialogservice.open(dialog);
  } 
       
    /************************** Exporter données  CC ***********************************************/
    transformDataCCForExport(data: MesureCC[]): any[] {
      return data.map(mesure => {
        const transformedData: any = {
          'ID': mesure.id,
          'Résultat': mesure.resultat,
          'Commentaire': mesure.commentaire,
          'Date': mesure.date,
          'Motif Saisie': mesure.motif_saisie,
          'Opérateur ID': mesure.operateur,
          'Opérateur Nom': mesure.operateurNom,
          'Qualiticien ID': mesure.qualiticien,
          'Qualiticien Nom': mesure.qualiticienNom,
          'État Conformité': mesure.etatactive,
          'État Validation': mesure.etatvalide,
          'Carte ID': mesure.carte?.id,
          'Carte Nom': mesure.carte?.nom
        };
    
        // Itérer sur chaque élément du tableau val et l'ajouter à transformedData
        mesure.val.forEach((valeur, index) => {
          transformedData[`Mesure  ${index + 1}`] = valeur;
        });
    
        return transformedData;
      });
    }
    
    
    
    exportCCToExcel(id: number): void {
      this.service.getMesureCCByCarteId(id).subscribe(mesure => {
        this.listeMesure = mesure.reverse();
        console.log("Mesure cc : ", mesure);
    
        const transformedData = this.transformDataCCForExport(this.listeMesure);
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(transformedData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        /* Sauvegarder le fichier */
        XLSX.writeFile(wb, "MesureCC"+id+".xlsx");
      });
    }
    


    /****************************** Exporter Données OKD *************************************************************/
    transformDataForExportOKD(data: MesureOKD[]): Observable<any[]> {
      const observables = data.map(mesure =>
        forkJoin(
          Object.keys(mesure.val).map(key =>
            this.service.getCritereById(parseInt(key)).pipe(
              map(critere => ({ key, critere })),
              catchError(error => of({ key, critere: null }))
            )
          )
        ).pipe(
          map(criteres => {
            const valData = {};
            criteres.forEach(({ key, critere }) => {
              if (critere) {
                valData[`${critere.nom}`] = mesure.val[key];
              } else {
                valData[`Critère inconnu`] = mesure.val[key];
              }
            });
            return {
              'ID': mesure.id,
              'Commentaire': mesure.commentaire,
              'Date Ajout': mesure.date_add,
              'Date Modification': mesure.date_modif,
              'Événement': mesure.evenement,
              'Équipe': mesure.equipe,
              'Nom Opérateur': mesure.operateurNom,
              'Prenom Opérateur': mesure.operateurPrenom,
              'Nom qualiticien': mesure.qualiticienNom,
              'Prenom qualiticien': mesure.qualiticienPrenom,
              'État Conformité': mesure.etatactive,
              'État Validation': mesure.etatvalide,
              'OKD ID': mesure.okd?.id,
              'OKD REF': mesure.okd?.ref,
              'OKD Nom': mesure.okd?.nom,
              ...valData
            };
          })
        )
      );
    
      return forkJoin(observables);
    }
    
    exportOKDToExcel(id: number): void {
      this.service.getMesureOKDByOKDExportId(id).subscribe(async mesure => {
        this.listemesureOKD = mesure.reverse();
        console.log("okd possedeé ........ : ", mesure);
    
        const transformedData = await this.transformDataForExportOKD(this.listemesureOKD).toPromise();
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(transformedData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        /* Sauvegarder le fichier */
        XLSX.writeFile(wb, "MesureOKD"+id+".xlsx");
      });
    }
    
       
}
