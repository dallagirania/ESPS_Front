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



  source: LocalDataSource = new LocalDataSource();
  sourceCarte: LocalDataSource = new LocalDataSource();
  sourceCritere: LocalDataSource = new LocalDataSource();
  idP:any; 
  currentProcede= new Procede()
  
  critere= new Critere()
  carte=new CarteControle()
  listeOKD:OKD[]=[]
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
   //     console.log(okdAvecCrits.crits)
      });
    });
  //  this.source = new LocalDataSource(this.listeOKD);
  //  console.log("la liste des okds actuel est ", okds);
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
  this.service.getFormationByHabilitationId(h.id).subscribe(liste => {
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
       
       
}
