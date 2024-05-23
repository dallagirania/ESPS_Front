import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { CrudService } from '../../../Service/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Procede } from '../../../Model/Procede.model';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { FormBuilder } from '@angular/forms';
import { Critere } from '../../../Model/Critere.model';
import { OKD } from '../../../Model/OKD.model';
import { Formation } from '../../../Model/Formation.model';
import { CarteControle } from '../../../Model/CarteControle.model';
import { Habilitation } from '../../../Model/Habilitation.model';
import { saveAs } from 'file-saver';

@Component({
  selector: 'ngx-pont',
  templateUrl: './pont.component.html',
  styleUrls: ['./pont.component.scss']
})
export class PontComponent implements OnInit, ViewCell {
  settingsCarte = {
    noDataMessage: 'Liste des Cartes de controle est vide',

    mode: "external",
  
    actions: {
      add: true,
  
      edit: true,
  
      delete: true,  
      position: 'right',
  
  
  
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      ref: {
        title: 'Référence',
        type: 'String',
      },
      nom: {
        title: 'Nom',
        type: 'string',
      },
     
      // att1: {
      //   title: 'Document1',
      //   type: 'html',
      //   filter: false,
      //   valuePrepareFunction: (cell, row) => `<img src="../../assets/images/pdf.png" (click)="download('${row.att1}')">`,
      // },
      // att2: {
      //   title: 'Document2',
      //   type: 'string',
      // },
      
    
    },
  };
  settings = {
    noDataMessage: 'Liste des Check-list "OK DEMARRAGE" est vide',

    mode: "external",
  
    actions: {
      add: true,
  
      edit: true,
  
      delete: true,  
      position: 'right',
  
  
  
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      ref: {
        title: 'Référence',
        type: 'String',
      },
      nom: {
        title: 'Nom',
        type: 'string',
      },
      date_init: {
        title: 'Date Initiale',
        type: 'string',
      },
     
      // att1: {
      //   title: 'Document1',
      //   type: 'html',
      //   filter: false,
      //   valuePrepareFunction: (cell, row) => `<img src="../../assets/images/pdf.png" (click)="download('${row.att1}')">`,
      // },
      // att2: {
      //   title: 'Document2',
      //   type: 'string',
      // },
      
    
    },
  };

  settingsCritere = {
    noDataMessage: 'Liste des  critéres  est vide',

    mode: "external",
  
    actions: {
      add: true,
  
      edit: true,
  
      delete: true,  
      position: 'right',
  
  
  
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
     
      ref: {
        title: 'Réference',
        type: 'string',
      },
      titre: {
        title: 'Titre',
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
  @Input() value: string;

  @Input() rowData: any;

  constructor(
    private dialogservice: NbDialogService,
    private service: CrudService,
    private router: Router,
    private fb: FormBuilder,
    private toastrService: NbToastrService,
    private rout:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.renderValue = this.value;
 ///  console.log("====> " + this.value );
  }
  detail(dialog: TemplateRef<any>) {
    this.dialogservice.open(dialog);
    this.service.getProcedeById(parseInt(this.value)).subscribe(procede => {
      this.currentProcede = procede;
      //console.log("le procede actuel est ",procede)
      for(let file of this.currentProcede.files){
        if(file.nom.endsWith('.png') || file.nom.endsWith('.jpg')){
      //    console.log(file.nom)
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
   //   console.log(this.currentProcede.date_fin)
      const dateSysteme = new Date();
   //   console.log(dateSysteme)
      const troisMoisApres = new Date();
      troisMoisApres.setMonth(dateSysteme.getMonth() + 3);
    //  console.log(troisMoisApres)
    
      if (dateFinProc >troisMoisApres) {
        this.etatQualif='Qualifié';
 //       console.log(this.etatQualif)
      } else {
        this.etatQualif= 'A Requalifier';
     //   console.log(this.etatQualif)
      }
    });

    
  this.service.getOKDByProcedeId(parseInt(this.value)).subscribe(okds => {
    this.listeOKDAvecCriteres = okds.map(okd => ({
      okd,
      crits: null
    }));
   this.listeOKDAvecCriteres.forEach(okdAvecCrits => {
      this.service.getCritereByOkdId(okdAvecCrits.okd.id).subscribe(criteres => {
        okdAvecCrits.crits = criteres;
      //  console.log(okdAvecCrits.crits)
      });
    });
   this.source = new LocalDataSource(this.listeOKD);
//    console.log("la liste des okds actuel est ", okds);
});

this.service.getCarteByProcedeId(parseInt(this.value)).subscribe(carte => {
this.listeCarte = carte;
this.sourceCarte = new LocalDataSource(this.listeCarte) 
//console.log("la liste des okds actuel est ",carte)
});

this.service.getHabilitationByProcedeId(parseInt(this.value)).subscribe(carte => {
this.listeHabilitation = carte;
this.sourceCritere = new LocalDataSource(this.listeHabilitation) 
//console.log("la liste des okds actuel est ",carte)
for(let h of this.listeHabilitation ){
  this.service.getFormationByHabilitationId(h.id).subscribe(liste => {
  //  console.log("test");
    this.listeFormation=liste;
    //console.log(liste);
  });
}
});
  }



  download(nom){
  
    this.service.download(nom).subscribe(res => {

      saveAs(res, "Procede" +nom);

    });
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




}
