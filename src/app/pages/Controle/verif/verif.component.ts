import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../../Service/crud.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { MesureCC } from '../../../Model/MesureCC.model';
import { Utilisateur } from '../../../Model/Utilisateur.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarteControle } from '../../../Model/CarteControle.model';
import { MesureOKD } from '../../../Model/MesureOKD.model';
import Swal from 'sweetalert2';
import { OperateurRenderComponent } from '../operateur-render/operateur-render.component';
import { ConformiteStyleComponent } from '../conformite-style/conformite-style.component';

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
   //  position: 'right',
 
   },
  
   edit: {
 
     editButtonContent: '<i class="nb-compose"></i>',
     saveButtonContent: '<i class="nb-checkmark "></i>',
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
    etatactive: {
      title: 'Conformité',     
      type: 'custom',
      valuePrepareFunction: (cell, row) => row.etatactive,
      renderComponent: ConformiteStyleComponent
  },
  
    etatvalide: {
      title: 'Validation',
      filter:{
        type: 'text',
        config: {
          placeholder: 'Validation(True/False)',
        },
      },
      type: 'html',
      valuePrepareFunction: (cell, row) => {
          console.log("Valeur de etatvalide :", row.etatvalide);
          if (row.etatvalide === false) {
            return '<i class="fas fa-times-circle fa-2x text-danger" ></i>';
        } else {
            return '<i class="fas fa-check fa-2x text-success"></i>';
        }
      },
  },
  carteNom: {
    title: 'Carte Controlle',
  },
    motif_saisie: {
      title: 'Motif Saisie',
      type: 'string',
    },
    operateurMatricule: {
      title: 'Matricule Opérateur',
      type: 'string',
    },
    min: {
      title: 'Valeur Min',
      type: 'string',
      
    },
    max: {
      title: 'Valeur Max',
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
    commentaire: {
      title: 'Commentaire',
      type: 'string',
    },

    qualiticienMatricule: {

      title: 'Matricule Qualiticien',
      type: 'string',
    },
  

  },
 }
 
 // Declaration SettingsMesureOKD : 
 SettingsOKD = {

  noDataMessage: 'Liste des Mesures "OK DEMARRAGE" est vide',

  mode: "external",

  actions: {
    add:false,
    edit: true,
    delete: false,
   // position: 'right',



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

  id: {
    title: 'Les Mesures',
    type: 'custom',
    filter: false,
    renderComponent: OperateurRenderComponent
  },

  date_add: {
    title: 'Date Ajout',
    type: 'string',

  },
 okdNom:{
      title: 'OK DEMARRAGE',
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
        console.log("Valeur de etatvalide :", row.etatvalide);
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
  
    commentaire: {
      title: 'Commentaire',
      type: 'string',
    },


    qualiticienMatricule: {

      title: 'Matricule Qualiticien',
      type: 'string',
    },
  

  }
}

currentuser:any
userConnecte:any
 listeMesure:MesureCC[]=[]
 listemesureOKD:MesureOKD[]=[]
 utilisateur =new Utilisateur()
 carte= new CarteControle()
 carte1= new CarteControle()
 sourceMesure: LocalDataSource = new LocalDataSource();
 sourceMesureOKD :LocalDataSource = new LocalDataSource();
 mesurecc=new MesureCC()
 mesureokd=new MesureOKD()
 dialogRef1:NbDialogRef<any>
 dialogvalideCarte:TemplateRef<any>
 @ViewChild('dialogValideCarte', { static: false }) dialogValideCarte: TemplateRef<any>;
  constructor(
    private service:CrudService,
    private route:Router,
    private toastrService: NbToastrService,
    private dialogservice: NbDialogService,
  ) { }

  ngOnInit(): void {
    this.userConnecte=localStorage.getItem("user")
    this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur=>{
      this.currentuser=utilisateur
      console.log("Info header  :",this.currentuser )    
  })
    this.LoadMesureCC()
    
    this.LoadMesureOKD()
      
  }


/************************ Validation des Cartes de controle *********************************** */
Valider(event: any): void {
  this.mesurecc= event.data;
  console.log("mesureOKD à valider  avant confirmation : => ",this.mesurecc)
  Swal.fire({

    title: 'Attention !',

    text: "Etes vous sûr de valider cette mesure  ?",

    icon: 'warning',

    showCancelButton: true,

    confirmButtonColor: '#28a745',

    cancelButtonColor: '#dc3545',

    confirmButtonText: 'Oui, Valider!',
    input: 'textarea',
    inputPlaceholder: 'Ajouter un commentaire (optionnel)',
  }).then((result) => {

    if (result.isConfirmed) {
      // Récupération du commentaire
      const commentaire = result.value;
      this.mesurecc.etatvalide = true;
      this.mesurecc.qualiticien=this.currentuser.id
      this.mesurecc.commentaire=commentaire
      const currentDate = new Date();
      const localDate = new Date(currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000) + (60 * 60000)); // Ajoute une heure en millisecondes
      const formattedDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')} ${String(localDate.getHours()).padStart(2, '0')}:${String(localDate.getMinutes()).padStart(2, '0')}`;
      this.mesurecc.date_valide =formattedDate
      event.actif=false;
    
      this.service.updateMesureCC(this.mesurecc.id,this.mesurecc).subscribe(data => {
       this.toastrService.success("Validation avec succés", "Succés", {duration: 5000, });
      if(this.mesurecc.etatactive == false){
       this.service.mailValidation(this.mesurecc).subscribe(mail=>{
         console.log("mail validation est envoyé avec succés")
       })
      }
        this.LoadMesureCC();
         },
          error => {
          this.toastrService.danger("Merci de contacter le service IT", 'Erreur');
        });

    }

  })

}

LoadMesureCC(){
  this.service.getAllMesureCC().subscribe(mesure=>{
    this.listeMesure=mesure.reverse()
     console.log("la liste des mesure Carte Controle :=> ",mesure)
     this.sourceMesure.load(mesure);
   })
}


/********************************** VERIFICATION OKD ****************************************** */
Validerokd(event: any): void {
  // const carte1= event.data;
  // this.carte1 = { ...carte1 };
  // this.dialogRef1 = this.dialogservice.open(this.dialogValideCarte, { context: { carte1: this.carte1 } });

  this.mesureokd= event.data;
  console.log("mesureOKD à valider  avant confirmation : => ",this.mesureokd)
  Swal.fire({

    title: 'Attention !',

    text: "Etes vous sûr de valider cette mesure  ?",

    icon: 'warning',

    showCancelButton: true,

    confirmButtonColor: '#28a745',

    cancelButtonColor: '#dc3545',

    confirmButtonText: 'Oui, Valider!',
    input: 'textarea',
    inputPlaceholder: 'Ajouter un commentaire (optionnel)',

  }).then((result) => {

    if (result.isConfirmed) {
      // Récupération du commentaire
      const commentaire = result.value;
     
      this.mesureokd.etatvalide = true;
      this.mesureokd.qualiticien=this.currentuser.id
      this.mesureokd.commentaire=commentaire
      const currentDate = new Date();
      const localDate = new Date(currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000) + (60 * 60000)); // Ajoute une heure en millisecondes
      const formattedDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')} ${String(localDate.getHours()).padStart(2, '0')}:${String(localDate.getMinutes()).padStart(2, '0')}`;
      this.mesureokd.date_modif =formattedDate
      event.actif=false;
      this.service.updateMesureOKD( this.mesureokd.id,this.mesureokd).subscribe(data => {
        this.toastrService.success("Validation avec succés", "Succés", {duration: 5000, });
        if(this.mesureokd.etatactive == false){
          this.service.mailValidationOKD(this.mesureokd).subscribe(mail=>{
            console.log("mail validation est envoyé avec succés")
          })
         }
        this.LoadMesureOKD();
         },
          error => {
          this.toastrService.danger("Merci de contacter le service IT", 'Erreur');
        });

    }

  })
  
}

LoadMesureOKD(){
  this.service.getMesureOKD().subscribe(mesure=>{
    this.listemesureOKD=mesure.reverse();
    console.log("liste okd : => :",this.listemesureOKD)
    this.sourceMesureOKD = new LocalDataSource(this.listemesureOKD) 
    })
}
}
