import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Procede } from '../../../Model/Procede.model';
import { CrudService } from '../../../Service/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import Swal from 'sweetalert2';
import { Files } from '../../../Model/Files.model';
import { LocalDataSource } from 'ng2-smart-table';
import { Atelier } from '../../../Model/Atelier.model';
import { Activite } from '../../../Model/Activite.model';
import { OKD } from '../../../Model/OKD.model';
import { Critere } from '../../../Model/Critere.model';
import { CarteControle } from '../../../Model/CarteControle.model';
import { Habilitation } from '../../../Model/Habilitation.model';
import { Formation } from '../../../Model/Formation.model';
import { Utilisateur } from '../../../Model/Utilisateur.model';
import { formatDate } from '@angular/common';
import { ModFormation } from '../../../Model/ModFormation.model';
import { HistoriqueFormationComponent } from '../historique-formation/historique-formation.component';
import { ModProcede } from '../../../Model/ModProcede.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'ngx-edit-procede',
  templateUrl: './edit-procede.component.html',
  styleUrls: ['./edit-procede.component.scss']
})
export class EditProcedeComponent implements OnInit {

   //Declaaration  settingFormation
   settingFormation = {
    noDataMessage: 'Liste des habilitations est vide',

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
      editable: (row: any) => {
        return row.etatactive; // Retourne true si etatactive est true, sinon retourne false
      },
     
    },
    delete: {
      deleteButtonContent: '<i class="fas fa-user-lock"></i>',
      confirmDelete: true,
    },
    pager: {
      display: true,
      perPage: 2, // Limiter le nombre de lignes par page à 5
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
        title: 'Date Habilitation',
        type: 'String',
      },
      date_fin: {
        title: 'Date Fin Habilitation',
        type: 'string',
      },
      etatactive: {
        title: 'Etat',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          console.log(row.etatactive)
          const etat =this.getEtat(row.etatactive);
          if(etat=="Activé"){
            console.log(this.getEtat(row.etatactive))
             return "<p class='text-success'>Activé</p>"
           }
          else{
            console.log(this.getEtat(row.etatactive))
            return "<p class='text-danger'>Désactivé</p>"
          }
        },
      
       
      },
      id: {
        title: 'Historiques',
        type: 'custom',
        filter: false,
        renderComponent: HistoriqueFormationComponent, 
      },
      
     
    },
  };
 //Declaration SettingsCarte
 SettingsCarte = {
  noDataMessage: 'Liste des cartes de Controle est vide',
  mode: "external",
  actions: {
    add:true,
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

    confirmSave: true,

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

    nom: {

      title: 'Nom',

      type: 'string',

    },

    nb_valeur: {

      title: 'Nb Valeur',

      type: 'number',

    },
    min: {

      title: 'Valeur Min',

      type: 'number',

    },
    max: {

      title: 'Valeur Max',

      type: 'number',

    },

    fonction: {

      title: 'Fonction',

      type: 'string',

    },


  }
}
 //Declaration SettingsCarte
 SettingsOKD = {

  noDataMessage: 'Liste des cartes de Controle est vide',

  mode: "external",

  actions: {
    add:true,
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

    confirmSave: true,

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

    nom: {

      title: 'Nom',

      type: 'string',

    },
    date_init: {

      title: 'Date Creation',

      type: 'string',

    },
  }
}

 //Declaration SettingsCarte
 SettingsListe = {

  noDataMessage: 'Aucun Liste d\'Habilitation trouvée',

  mode: "external",

  actions: {
    add:true,
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

    confirmSave: true,

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
  }
}

 //Declaration SettingsCritere
 settingCritere = {

  noDataMessage: 'Aucun Criteretrouvée',

  mode: "external",

  actions: {
    add:true,
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

    confirmSave: true,

  },

  delete: {

    deleteButtonContent: '<i class="nb-trash"></i>',

    confirmDelete: true,

  },
 
 columns: {

    nom: {

      title: 'Nom',

      type: 'string',

    },

    type: {

      title: 'type',

      type: 'string',

    },
    
  }
}
  idP: any;
  currentProcede=new Procede()
  mydate=new Date()
  userFile1:any
  message1?:String
  imgURL1:any
  imagePath1:any

  userFile2:any
  message2?:String
  imgURL2:any
  imagePath2:any
  selectedActivite:any
  activites:Activite[]=[]
  listeAtelier:Atelier[]=[]
  selectedAtelier:any
  r: boolean = true;
  files:any[] = [];
  listfiles: LocalDataSource = new LocalDataSource();
  f: Files = new Files(); // Assurez-vous que la classe File est définie correctement
  lf: any[] = [];

  listeOKD:OKD[]=[]
  Listecriteres: Critere[] = [];
  listeCc:CarteControle[]=[]
  listeHabilitation:Habilitation[]=[]
  listeFormation:Formation[]=[]
  showFunctionInput: boolean = false;
  listeProcede: Procede[]=[]
  procede:Procede =new Procede()
  okd:OKD =new OKD()
  newOkd:OKD =new OKD()
  newFormation:Formation =new Formation()
  formation:Formation =new Formation()
  formation1:Formation =new Formation()
  carte:CarteControle =new CarteControle()
 
  habilitation:Habilitation =new Habilitation()
  newHabilitation:Habilitation =new Habilitation()
  habilitation1:Habilitation =new Habilitation()
  listeUser:Utilisateur[]=[]

  criteres: Critere[] = [];
  carte1:CarteControle=new CarteControle()
  newCarte:CarteControle=new CarteControle()

  critere:Critere=new Critere()
  critere1:Critere=new Critere()
  newCritere:Critere=new Critere()

  okd1:OKD =new OKD()
 
  listeOKDExtraction:OKD[]=[]
  listeHabilitationExtractés:Habilitation[]=[]
 
  habilitationfinal:Habilitation=new Habilitation()
  okdFinale:OKD =new OKD()
  id:any
  selectedCollab:any

  formations: Formation[] = [];
  modFormation:ModFormation=new ModFormation()
  showSmartTable: boolean = false;

  modProcede:ModProcede=new ModProcede()
  userConnecte:any
  currentuser:any

  user:Utilisateur=new Utilisateur()
  UserNom:String
  UserPrenom:String

  dialogRef:NbDialogRef<any>
  dialogedit:TemplateRef<any>
  @ViewChild('dialogEdit', { static: false }) dialogEdit: TemplateRef<any>;

  
  dialogRef1:NbDialogRef<any>
  dialogeditOKD:TemplateRef<any>
  @ViewChild('dialogEditOKD', { static: false }) dialogEditOKD: TemplateRef<any>;

  dialogRef2:NbDialogRef<any>
  dialogeditcritere:TemplateRef<any>
  @ViewChild('dialogEditcritere', { static: false }) dialogEditcritere: TemplateRef<any>;
  
  dialogRef3:NbDialogRef<any>
  dialogeditHabilitation:TemplateRef<any>
  @ViewChild('dialogEditHabilitation', { static: false }) dialogEditHabilitation: TemplateRef<any>;

  dialogRef4:NbDialogRef<any>
  dialogeditFormation:TemplateRef<any>
  @ViewChild('dialogEditFormation', { static: false }) dialogEditFormation: TemplateRef<any>;
  
  

 //Declaration sources 
 sourceCarte :LocalDataSource = new LocalDataSource();
 //Declaration sources 
 sourceOKD :LocalDataSource = new LocalDataSource();
 //Declaration sources 
 sourceListe :LocalDataSource = new LocalDataSource();

 sourceCritere :LocalDataSource = new LocalDataSource();
 sourceFormation :LocalDataSource = new LocalDataSource();

 listeUser1:Utilisateur[]=[]
 listeUserNotInListe:Utilisateur[]=[]
 dropdownSettings = {};
  constructor(
     private service: CrudService,
     private router: Router,
     private fb: FormBuilder,
     private dialogservice: NbDialogService,
     private toastrService: NbToastrService,
     private rout:ActivatedRoute)
      { 

     }
  ngOnInit(): void {
    this.idP=this.rout.snapshot.params["id"];
    this.service.getProcedeById(this.idP).subscribe(procede => {
      this.currentProcede = procede;
      console.log("le procede actuel est ",procede)
    });
    this.service.getAtelier().subscribe(ateliers => {
      this.listeAtelier = ateliers;
      console.log("la liste des ateliers",ateliers)
    });
    this.service.getActivite().subscribe(activites => {
      this.activites = activites;
      console.log("la liste des activites",activites)
    });
    this.getCarteByProcedeId(this.idP)
    this.getOKDByProcedeId(this.idP)
    this.getHabilitationByProcedeId(this.idP)
    this.getMOD()

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'matricule',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.userConnecte=localStorage.getItem("user")
this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur=>{
  this.currentuser=utilisateur
  console.log("Info header  :",this.currentuser )    
})
  }
 
  
  
  getEtat(etatactive: boolean): string {
    if (etatactive==true) {
      return 'Activé';
    } else {
      return 'Désactivé';
    }
  }
  getMOD(): void {
    this.service.getMOD().subscribe(user=>{
      this.listeUser=user;
      console.log("test1111",this.listeUser)
    })

   
  }

  getOKDByProcedeId(procedeId: number): void {
    this.service.getOKDByProcedeId(procedeId).subscribe(carte=>{
      this.listeOKD = carte;
      console.log(this.listeOKD);
      this.sourceOKD = new LocalDataSource(this.listeOKD); 
    });
  }


  getCarteByProcedeId(procedeId: number): void {
    this.service.getCarteByProcedeId(procedeId).subscribe(carte=>{
      this.listeCc = carte;
      console.log(this.listeCc);
      this.sourceCarte = new LocalDataSource(this.listeCc); 
    });
  }
  
  getHabilitationByProcedeId(procedeId: number): void {
    this.service.getHabilitationByProcedeId(procedeId).subscribe(carte=>{
      this.listeHabilitation = carte;
      console.log(this.listeHabilitation);
      this.sourceListe= new LocalDataSource(this.listeHabilitation); 
    });
  }
  getCritereByOkdId(id:any){
    this.service.getCritereByOkdId(this.okd1.id).subscribe(liste => {
      console.log("test");
      this.Listecriteres=liste;
      this.sourceCritere = new LocalDataSource(this.Listecriteres) 
      console.log(liste);
    });
  }
  LoadFormationByHabilitation(id:any) {
    this.service.getFormationByDernierDate(this.habilitation1.id).subscribe(liste => {
      console.log("test");
      this.listeFormation=liste.reverse();
      this.sourceFormation = new LocalDataSource(this.listeFormation)
      console.log(liste); 
    });
  }
      loadActivites() {
  
      if (this.selectedActivite) {
        this.service.getAteliersByActiviteId(this.selectedActivite).subscribe(at=>{
          this.listeAtelier=at
          
      }) 
    }

    }
 
    modifierProcede(){
     this.idP=this.rout.snapshot.params["id"];
     console.log(this.idP);
     this.service.updateProcede(this.idP,this.currentProcede).subscribe(procede=>{
     
      console.log('Procédé modified successfully:',this.currentProcede);
      Swal.fire({
        title: 'Succès!',
        text: 'La modification a été effectué avec succès.',
        icon: 'success',
        confirmButtonColor: '#0CA417',
        confirmButtonText: 'OK'
      });
      this.router.navigate(["/pages/ListProcede"])
    },
    (error) => {
      console.error('Error editing Procédé:', error);
      this.toastrService.danger('Erreur lors du modification du procédé', 'Erreur');
  
    })
    }

    uploadFiles(event) {
      this.r = true;
      this.listfiles = new LocalDataSource();
      const element = event.currentTarget as HTMLInputElement;
      let fileList: FileList | null = element.files;
  
      if (fileList.length > 0) {
  
        const file: File = fileList[0];
        console.log(file)
   
  
        const maxSizeInBytes = 20 * 1024 * 1024; // 40MB in bytes
  
        if (file.size > maxSizeInBytes) {
  
          this.toastrService.danger('La taille maximale du fichier est 20 MB',  'Erreur')
  
          return;
  
        }
  
      }
      if (fileList) {
  
        Array.from(fileList).forEach(file => {
          this.lf.push(file);
        });
      } 
      console.log(this.lf)
      this.listfiles = new LocalDataSource(this.lf);     
      this.files = event.target.files;
      // this.lf.push(this.files);
      console.log(this.lf)
    }
  
  


    tabs: any[] = [
      {
        title: 'Route tab #1',
        route: '/pages/layout/tabs/tab1',
      },
      {
        title: 'Route tab #2',
        route: '/pages/layout/tabs/tab2',
      },
    ];

    //supprision de Carte Controle 
 OnDeleteConfirmCarte(event) {
  this.carte= event.data;
  console.log(this.carte.id)
  Swal.fire({

    title: 'Attention !',

    text: "Etes vous sûr de vouloir supprimer cette carte de controle  ?",

    icon: 'warning',

    showCancelButton: true,

    confirmButtonColor: '#3085d6',

    cancelButtonColor: '#d33',

    confirmButtonText: 'Oui, supprimer!'

  }).then((result) => {

    if (result.isConfirmed) {

      this.carte.etatactive = false;

      event.actif=false;

      this.service.updateCC( this.carte.id,this.carte).subscribe(data => {
        this.toastrService.success("Suppression avec succés", "Succés", {
          duration: 5000,
            });

        this.getCarteByProcedeId(this.currentProcede.id);



      },

        error => {
          this.toastrService.danger("Merci de contacter le service IT", 'Erreur');
         

        });

    }

  })

}
//supprision des OKD
OnDeleteConfirmOKD(event) {
  this.okd= event.data;
  console.log(this.okd.id)
  Swal.fire({

    title: 'Attention !',

    text: "Etes vous sûr de vouloir supprimer cette Check-list <<OK DEMMARAGE >>  ?",

    icon: 'warning',

    showCancelButton: true,

    confirmButtonColor: '#3085d6',

    cancelButtonColor: '#d33',

    confirmButtonText: 'Oui, supprimer!'

  }).then((result) => {

    if (result.isConfirmed) {

      this.okd.etatactive = false;

      event.actif=false;

      this.service.updateOKD( this.okd.id,this.okd).subscribe(data => {
        this.toastrService.success("Suppression avec succés", "Succés", {
          duration: 5000,
            });

        this.getOKDByProcedeId(this.currentProcede.id);



      },

        error => {
          this.toastrService.danger("Merci de contacter le service IT", 'Erreur');
         

        });

    }

  })

}
//Modification OK DEMMARAGE :
        //Edite Site 
        editOKD(event: any): void {
          const okd1 = event.data;
          this.okd1 = { ...okd1 };
          this.dialogRef1 = this.dialogservice.open(this.dialogEditOKD, { context: { okd1: this.okd1 } });
          this.service.getCritereByOkdId(this.okd1.id).subscribe(liste => {
            console.log("test");
            this.Listecriteres=liste;
            this.sourceCritere = new LocalDataSource(this.Listecriteres) 
            console.log(liste);
          });
         }
              
            //Open model edite  :
            modifierOKD(ref: NbDialogRef<any>): void {
             this.okd1.ref= this.okd1.ref
             this.okd1.nom= this.okd1.nom
             this.okd1.designation= this.okd1.designation
             this.okd1.procede=this.currentProcede
             this.service.updateOKD(this.okd1.id,this.okd1).subscribe(
               () => {
                 console.log('okd1 edited successfully:');
                 this.getOKDByProcedeId(this.currentProcede.id);
                 ref.close();
                 this.toastrService.success('OK DEMARRAGE modifié avec succès', 'Succès', {
                   duration: 5000,
                     });       
               },
               error => {
         
                 console.error('Erreur Modification User: ', error);
                 this.toastrService.danger('Erreur lors du modification du User ,Contacter le service IT', 'Erreur');
               }
             );
           }

            //Modification Critere :
        //Edite Site 
        editCritere(event: any): void {
          const critere1 = event.data;
          this.critere1 = { ...critere1 };
          this.dialogRef2 = this.dialogservice.open(this.dialogEditcritere, { context: { critere1: this.critere1 } });
         
         }
              
            //Open model edite  :
            modifierCritere(ref: NbDialogRef<any>): void {
              if (this.critere1.type === 'valeur') {
                const min = parseInt(this.critere1.min.toString());
                const max = parseInt(this.critere1.max.toString());
                console.log("min : ",min, "max : " ,max)
                if (min >= max) {
                  this.toastrService.danger('La valeur de min doit être inférieure à la valeur de max', 'Erreur');
                  return;
                }
              }
             this.critere1.type= this.critere1.type
             this.critere1.nom= this.critere1.nom
             this.critere1.min= this.critere1.min
             this.critere1.max= this.critere1.max
             this.critere1.okd=this.okd1
             this.service.updateCritere(this.critere1.id,this.critere1).subscribe(
               () => {
                 console.log('okd1 edited successfully:');
                 this.getCritereByOkdId(this.okd1.id);
                 ref.close();
                 this.toastrService.success('OK DEMARRAGE modifié avec succès', 'Succès', {
                   duration: 5000,
                     });       
               },
               error => {
         
                 console.error('Erreur Modification User: ', error);
                 this.toastrService.danger('Erreur lors du modification du User ,Contacter le service IT', 'Erreur');
               }
             );
           }

           //Ajout Critere pour un OKD Donnée
add(dialog: TemplateRef<any>) {
  
  this.newCritere= new Critere();

  this.dialogservice.open(dialog);
  }

  AddCri(ref: NbDialogRef<any>): void {
    if (!this.newCritere.type || !this.newCritere.nom) {
      // Afficher un toast d'erreur
      this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
      return;
    }
    if (this.newCritere.type === 'valeur') {
      const min = parseInt(this.newCritere.min.toString());
      const max = parseInt(this.newCritere.max.toString());
      console.log("min : ",min, "max : " ,max)
      if (min >= max) {
        this.toastrService.danger('La valeur de min doit être inférieure à la valeur de max', 'Erreur');
        return;
      }
    }
      this.newCritere.okd=this.okd1,
   
      this.service.addCritere(this.newCritere).subscribe(
      (site1) => {
        console.log('Critere added successfully:', site1);
        Swal.fire({
          title: 'Succès!',
          text: 'L\'ajout a été effectué avec succès.',
          icon: 'success',
          confirmButtonColor: '#0CA417',
          confirmButtonText: 'OK'
        });
        this.newCritere.nom="";
        this.newCritere.nom="";
        this.newCritere.min="";
        this.newCritere.max="";
        this.getCritereByOkdId(this.okd1.id)
        ref.close();
       
      },
      (error) => {
        console.error('Error adding site:', error);
        this.toastrService.danger('Erreur lors de l\'ajout du site', 'Erreur');
    
      }
    );
  }
  //supprision des Criteres
OnDeleteConfirmCritere(event) {
  this.critere= event.data;
  Swal.fire({

    title: 'Attention !',

    text: "Etes vous sûr de vouloir supprimer cette Critere?",

    icon: 'warning',

    showCancelButton: true,

    confirmButtonColor: '#28a745',

    cancelButtonColor: '#dc3545',

    confirmButtonText: 'Oui, supprimer!'

  }).then((result) => {

    if (result.isConfirmed) {

      this.critere.etatactive = false;
      event.actif=false;
      this.service.updateCritere( this.critere.id,this.critere).subscribe(data => {
        this.toastrService.success("Suppression avec succés", "Succés", {
          duration: 5000,
            });

        this.getCritereByOkdId(this.okd1.id);
         },
          error => {
          this.toastrService.danger("Merci de contacter le service IT", 'Erreur');
        });

    }

  })

}
//Modification Carte Controle :
        //Edite Site 
        modifier(event: any): void {
          const carte1 = event.data;
          this.carte1 = { ...carte1 };
          this.dialogRef = this.dialogservice.open(this.dialogEdit, { context: { carte1: this.carte1 } });
         }
              
            //Open model edite  :
            modifierCarte(ref: NbDialogRef<any>): void {
              const min = parseInt(this.carte1.min.toString());
              const max = parseInt(this.carte1.max.toString());
              console.log("min : ",min, "max : " ,max)
              if (min >= max) {
                this.toastrService.danger('La valeur de min doit être inférieure à la valeur de max', 'Erreur');
                return;
              }
              if(this.carte1.fonction){
                const fonctionRegExp = /^(\((V\d+|\d+)([+\-*\/](V\d+|\d+))*\)|V\d+|\d+)([+\-*\/](\((V\d+|\d+)([+\-*\/](V\d+|\d+))*\)|V\d+|\d+))*$/;
            
            
                // Vérification si la fonction correspond au modèle spécifié
                if (!fonctionRegExp.test(this.carte1.fonction)) {
                  this.toastrService.danger('Veuillez vérifier votre fonction. Elle doit être sous la forme : V1+V2*V3, etc.', 'Erreur');
                  return;
                }
              
                const fonction = this.carte1.fonction;
              
                const match = fonction.match(/V(\d+)/g);
                if (match) {
                  const dernierNombre = match[match.length - 1];
                  const nombreMaxDeValeurs = parseInt(dernierNombre.substring(1), 10);
                  const nbValeurs = this.carte1.nb_valeur || 0;
                  console.log(nombreMaxDeValeurs, nbValeurs)
                  // Vérification si le nombre de valeurs est inférieur au nombre maximum
                  if (nbValeurs < nombreMaxDeValeurs) {
                    this.toastrService.danger('Veuillez verifier votre Fonction  !!!  La fonction est composée par un excés de valeur..', 'Erreur');
                    return;
                  }else if (nbValeurs > nombreMaxDeValeurs) {
                    this.toastrService.danger('Veuillez verifier votre Fonction  !!!  La fonction ne comporte pas les valeurs necessaire.', 'Erreur');
                    return;  
                }}
              }
             this.carte1.ref= this.carte1.ref
             this.carte1.nom= this.carte1.nom
             this.carte1.nb_valeur= this.carte1.nb_valeur
             this.carte1.fonction= this.carte1.fonction
             this.carte1.procede=this.currentProcede
             this.service.updateCC(this.carte1.id,this.carte1).subscribe(
               () => {
                 console.log('Carte edited successfully:');
                 this.getCarteByProcedeId(this.currentProcede.id);
                 ref.close();
                 this.toastrService.success('Carte de controle modifié avec succès', 'Succès', {
                   duration: 5000,
                     });       
               },
               error => {
         
                 console.error('Erreur Modification User: ', error);
                 this.toastrService.danger('Erreur lors du modification du User ,Contacter le service IT', 'Erreur');
               }
             );
           }

           //supprision d'habilitation :
           //supprision des Habilitation
OnDeleteConfirm(event) {
  this.habilitation= event.data;
  Swal.fire({

    title: 'Attention !',

    text: "Etes vous sûr de vouloir supprimer cette Liste d'Habilitation ?",

    icon: 'warning',

    showCancelButton: true,

    confirmButtonColor: '#28a745',

    cancelButtonColor: '#dc3545',

    confirmButtonText: 'Oui, supprimer!'

  }).then((result) => {

    if (result.isConfirmed) {

      this.habilitation.etatactive = false;
      event.actif=false;
      this.service.updateHabilitation( this.habilitation.id,this.habilitation).subscribe(data => {
        this.toastrService.success("Suppression avec succés", "Succés", {
          duration: 5000,
            });

        this.getHabilitationByProcedeId(this.currentProcede.id);
         },
          error => {
          this.toastrService.danger("Merci de contacter le service IT", 'Erreur');
        });

    }

  })

}
 //Modifier Liste Habilitaion 
        //Edite Site 
        editHabilitation(event: any): void {
          const habilitation1 = event.data;
          this.habilitation1 = { ...habilitation1 };
          this.service.getMOD().subscribe(users => {
      this.listeUser1 = users;
      console.log("Liste complète des utilisateurs:", this.listeUser1);
    });
    this.service.getFormationByDernierDate(this.habilitation1.id).subscribe(liste => {
      console.log("test");
      this.listeFormation=liste.reverse();
      console.log(this.listeFormation);
       //Eliminer la redondance des users  
      this.service.getAllUserByHabilitationId(this.habilitation1.id).subscribe(liste => {
        console.log("test users ");
        this.listeUser=liste.reverse();
        console.log(this.listeUser);
      // Filtrer listeUser1 pour obtenir les utilisateurs qui ne sont pas dans listeUser
      this.listeUserNotInListe = this.listeUser1.filter(user1 => !this.listeUser.some(user => user.id === user1.id));

      console.log("Utilisateurs non présents dans listeUser:", this.listeUserNotInListe);
      
      });
      this.sourceFormation = new LocalDataSource(this.listeFormation) 
      this.dialogRef3 = this.dialogservice.open(this.dialogEditHabilitation, { context: { habilitation1: this.habilitation1 } });
      console.log(liste);
    });
         }
              
            //Open model edite  :
            modifierHabilitation(ref: NbDialogRef<any>): void {
             this.habilitation1.ref= this.habilitation1.ref
             this.habilitation1.titre= this.habilitation1.titre
             this.habilitation1.procede=this.currentProcede
             this.service.updateHabilitation(this.habilitation1.id,this.habilitation1).subscribe(
               () => {
                 console.log('habilitation1 edited successfully:');
                 this.getHabilitationByProcedeId(this.currentProcede.id);
                 ref.close();
                 this.toastrService.success('Liste habilitation modifiée avec succès', 'Succès', {
                   duration: 5000,
                     });       
               },
               error => {
         
                 console.error('Erreur Modification User: ', error);
                 this.toastrService.danger('Erreur lors du modification du User ,Contacter le service IT', 'Erreur');
               }
             );
           }
 

     //Gestion des formations 
     OnDeleteConfirmFor(event) {
      this.formation= event.data;
      Swal.fire({
  
        title: 'Attention !',
  
        text: "EEtes vous sûr de vouloir modifier l'accés de cette Habilitation  ?",
  
        icon: 'warning',
  
        showCancelButton: true,
  
        confirmButtonColor: '#28a745',
  
        cancelButtonColor: '#dc3545',
  
        confirmButtonText: 'Oui, supprimer!'
  
      }).then((result) => {
  
        if (result.isConfirmed) {
  
          if(this.formation.etatactive){
            this.formation.etatactive=false
          }
          else{
            this.formation.etatactive=true 
          }
          event.actif=false;
          this.service.supprimerFormation( this.formation.id,this.formation).subscribe(data => {
            this.toastrService.success("Suppression avec succés", "Succés", {
              duration: 5000,
                });
  
            this.LoadFormationByHabilitation(this.habilitation1.id);
             },
              error => {
              this.toastrService.danger("Merci de contacter le service IT", 'Erreur');
            });
  
        }
  
      })
  
    }

        //Modification Formation :
        //Edite Site 
  editFormation(event: any): void {
          const formation1 = event.data;
          this.formation1 = { ...formation1 };
          this.dialogRef4 = this.dialogservice.open(this.dialogEditFormation, { context: { formation1: this.formation1 } });
         
         }
            
            //Open model edite  :
  AddHistorique(ref: NbDialogRef<any>): void {
              if (!this.modFormation.date_fin || !this.modFormation.date_init||!this.files) {
                 this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
                 return;
               }
             console.log(this.modFormation);
              this.modFormation.formation = this.formation1;
              const formData = new FormData();
              formData.append('modformation', new Blob([JSON.stringify(this.modFormation)], {
                type: 'application/json'
              }));
              if (this.lf.length > 0) {
                          Array.from(this.lf).forEach(file => {
                           formData.append('files', file);
                          });
              this.service.addModFormation(formData).subscribe(
               (unite1) => {
                 console.log('Mise à jour added successfully:', unite1);
                
                 this.LoadFormationByHabilitation(this.habilitation1.id);
                 ref.close(); // Fermer la boîte de dialogue
                  // Réinitialiser les champs à vide
                  this.files = null; // Réinitialiser les fichiers
                  this.modFormation.date_fin = ""; 
                  this.modFormation.date_init = ""; //
                 this.toastrService.success('Modification ajouté avec succès', 'Succès', {
                   duration: 5000,
                     });
               },
               (error) => {
                 console.error('Error adding site:', error);
                 this.toastrService.danger('Merci de contacter le service IT ', 'Erreur');
               }
        
             );}
           
           }
      
            //Ajout de nouveau Formation 
   addFor(dialog: TemplateRef<any>) {
  
    this.newFormation= new Formation();
  
    this.dialogservice.open(dialog);
    }
  
SaveNewFormation(ref: NbDialogRef<any>): void {
  console.log(this.selectedCollab[0].id)
      if (!this.newFormation.date_fin || !this.newFormation.date_init ||!this.selectedCollab||!this.files) {
         this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
         return;
       }
     console.log(this.newFormation);
     if (this.selectedCollab) {
      // const selectedUserId = this.selectedUsers[i][0]; // Récupérer l'ID de l'utilisateur sélectionné
      // console.log(selectedUserId)
      //  const user: Utilisateur = { id: selectedUserId.id};
      //  formation.utilisateur = user; 
      const collabSelectionne: Utilisateur = { id: this.selectedCollab[0].id};
      this.newFormation.utilisateur = collabSelectionne;

      const habilitationSelectionne: Habilitation = { id: this.habilitation1.id };
      this.newFormation.habilitation = habilitationSelectionne;
      this.newFormation.qualit_id=this.currentuser.id
      const formData = new FormData();
      formData.append('formation', new Blob([JSON.stringify(this.newFormation)], {
        type: 'application/json'
      }));
      if (this.lf.length > 0) {
                  Array.from(this.lf).forEach(file => {
                   formData.append('files', file);
                  });
      this.service.addFormation(formData).subscribe(
       (unite1) => {
         console.log('formation added successfully:', unite1);
          this.LoadFormationByHabilitation(this.habilitation1.id);
         ref.close(); // Fermer la boîte de dialogue
          // Réinitialiser les champs à vide
          this.selectedCollab = null; // Réinitialiser la sélection de collaborateur
          this.files = null; // Réinitialiser les fichiers
          this.formation.date_fin = ""; 
          this.formation.date_init = ""; //
         this.toastrService.success('Habilitation ajouté avec succès', 'Succès', {
           duration: 5000,
             });
       },
       (error) => {
         console.error('Error adding site:', error);
         this.toastrService.danger('Merci de contacter le service IT ', 'Erreur');
       }

     );}
   }
   }

   updateEndDate(): void {
    if (this.newFormation.date_init) {
     
      const dateInit = new Date(this.newFormation.date_init.toString());
      const dateFin = new Date(dateInit.getFullYear() + 1, dateInit.getMonth(), dateInit.getDate());
      this.newFormation.date_fin = dateFin.toISOString().slice(0, 10);
    }
  }

  onDateInitChange(): void {
    this.updateEndDate();
  }

  updateEndDate1(): void {
    if (this.modFormation.date_init) {
     
      const dateInit = new Date(this.modFormation.date_init.toString());
      const dateFin = new Date(dateInit.getFullYear() + 1, dateInit.getMonth(), dateInit.getDate());
      this.modFormation.date_fin = dateFin.toISOString().slice(0, 10);
    }
  }

  onDateInitChange1(): void {
    this.updateEndDate1();
  }

  userDetail(index: number): void {
    if (this.selectedCollab) {
      const selectedUserId = this.selectedCollab[0]; // Récupérer l'ID de l'utilisateur sélectionné
      console.log(selectedUserId)
      this.service.getUserById(selectedUserId.id).subscribe(procede => {
      this.user = procede;
      console.log("le user actuel est ",procede)
      this.UserNom=this.user.username
      this.UserPrenom=this.user.prenom
      console.log(this.UserNom , this.UserPrenom)
        
      });
    }}




   resetFieldsCC(): void {
    this.newCarte.nom = "";
    this.newCarte.fonction = "";
    this.newCarte.ref = "";
    this.newCarte.min = "";
    this.newCarte.max = "";
    this.newCarte.nb_valeur = 0;
    this.habilitation.ref="";
    this.habilitation.titre="";
    this.newOkd.nom=""
    this.newOkd.ref=""
    this.newOkd.designation=""
  }
  checkInput() {
    // Vérifiez l'état du combobox pour déterminer si l'input de la fonction doit être affiché
    this.showFunctionInput = this.showFunctionInput;
  
  }
   //Ajout Carte Controle :
   createCarte(dialog: TemplateRef<any>) {
  
    this.newCarte= new CarteControle();
  
    this.dialogservice.open(dialog);
    }
  
    SaveCC(ref: NbDialogRef<any>): void  {
      console.log(this.newCarte);
      if (!this.newCarte.nom||!this.newCarte.ref||!this.newCarte.nb_valeur||!this.newCarte.max||!this.newCarte.min) {
        // Afficher un toast d'erreur
        this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
        return;
      }
      const min = parseInt(this.newCarte.min.toString());
      const max = parseInt(this.newCarte.max.toString());
      console.log("min : ",min, "max : " ,max)
      if (min >= max) {
        this.toastrService.danger('La valeur de min doit être inférieure à la valeur de max', 'Erreur');
        return;
      }
     
    
      if(this.newCarte.fonction){
        const fonctionRegExp = /^(\((V\d+|\d+)([+\-*\/](V\d+|\d+))*\)|V\d+|\d+)([+\-*\/](\((V\d+|\d+)([+\-*\/](V\d+|\d+))*\)|V\d+|\d+))*$/;
    
    
        // Vérification si la fonction correspond au modèle spécifié
        if (!fonctionRegExp.test(this.newCarte.fonction)) {
          this.toastrService.danger('Veuillez vérifier votre fonction. Elle doit être sous la forme : V1+V2*V3, etc.', 'Erreur');
          return;
        }
      
        const fonction = this.newCarte.fonction;
      
        const match = fonction.match(/V(\d+)/g);
        if (match) {
          const dernierNombre = match[match.length - 1];
          const nombreMaxDeValeurs = parseInt(dernierNombre.substring(1), 10);
          const nbValeurs = this.newCarte.nb_valeur || 0;
          console.log(nombreMaxDeValeurs, nbValeurs)
          // Vérification si le nombre de valeurs est inférieur au nombre maximum
          if (nbValeurs < nombreMaxDeValeurs) {
            this.toastrService.danger('Veuillez verifier votre Fonction  !!!  La fonction est composée par un excés de valeur..', 'Erreur');
            return;
          }else if (nbValeurs > nombreMaxDeValeurs) {
            this.toastrService.danger('Veuillez verifier votre Fonction  !!!  La fonction ne comporte pas les valeurs necessaire.', 'Erreur');
            return;  
        }}
      }
    
        this.newCarte.procede=this.currentProcede,
        console.log(this.newCarte);
        this.service.addCC(this.newCarte).subscribe(
        (site1) => {
          console.log('Carte De Controle added successfully:', site1);
          Swal.fire({
            title: 'Succès!',
            text: 'L\'ajout a été effectué avec succès.',
            icon: 'success',
            confirmButtonColor: '#0CA417',
            confirmButtonText: 'OK'
          });
          this.resetFieldsCC();
          ref.close();
          this.getCarteByProcedeId(this.currentProcede.id)
        },
        (error) => {
          console.error('Error adding site:', error);
          this.toastrService.danger('Erreur lors de l\'ajout du site', 'Erreur');
      
        }
      );
    }

     //Ajout OK DEMARRAGE :
     createOKD(dialog: TemplateRef<any>) {
   
     this.newOkd= new OKD();
   
     this.dialogservice.open(dialog);
     }
     SaveOKD(ref: NbDialogRef<any>): void  {
      if (!this.newOkd.nom || !this.newOkd.designation||!this.newOkd.ref) {
        // Afficher un toast d'erreur
        this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
        return;
      }
        this.newOkd.procede=this.currentProcede,
        this.newOkd.date_init=this.mydate.toISOString().slice(0,10)
        console.log(this.newOkd);
        this.service.addOKD(this.newOkd).subscribe(
        (site1) => {
          console.log('Check-List "OK DEMARRAGE" added successfully:', site1);
          Swal.fire({
            title: 'Succès!',
            text: 'L\'ajout a été effectué avec succès.',
            icon: 'success',
            confirmButtonColor: '#0CA417',
            confirmButtonText: 'OK'
          });
          this.resetFieldsCC();
          ref.close();
          this.getOKDByProcedeId(this.currentProcede.id)
        
        },
        (error) => {
          console.error('Error adding site:', error);
          this.toastrService.danger('Erreur lors de l\'ajout du site', 'Erreur');
      
        }
      );
    }

    //Ajout Habilitation :
    createHabili(dialog: TemplateRef<any>) {
   
      this.newHabilitation= new Habilitation();
    
      this.dialogservice.open(dialog);
      }

      SaveHabilitation(ref: NbDialogRef<any>): void   {
        if (!this.newHabilitation.titre || !this.newHabilitation.ref) {
          // Afficher un toast d'erreur
          this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
          return;
        }
          this.newHabilitation.procede=this.currentProcede,
       
          this.service.addHabilitation(this.newHabilitation).subscribe(
          (site1) => {
            console.log('la liste d\'habilitation added successfully:', site1);
            Swal.fire({
              title: 'Succès!',
              text: 'L\'ajout a été effectué avec succès.',
              icon: 'success',
              confirmButtonColor: '#0CA417',
              confirmButtonText: 'OK'
            });
           
            this.resetFieldsCC();
            ref.close();
            this.getHabilitationByProcedeId(this.currentProcede.id)
           
          },
          (error) => {
            console.error('Error adding site:', error);
            this.toastrService.danger('Erreur lors de l\'ajout du site', 'Erreur');
        
          }
        );
      }



  AddHistoriqueProcede(){
        if (!this.modProcede.date_fin || !this.modProcede.date_init||!this.files) {
           this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
           return;
         }

         const dateFinProc = new Date(this.modProcede.date_fin.toString());
         const datedebProc = new Date(this.modProcede.date_init.toString());
        //  console.log("date deb : ",datedebProc)
        //  console.log("date fin : ",dateFinProc)
        //  const troisAnsApres = new Date(datedebProc);
        //  troisAnsApres.setFullYear(datedebProc.getFullYear() + 3);
   
        //  console.log("Date de début :", datedebProc);
        //  console.log("Date de fin :", dateFinProc);
        //  console.log("Date de fin attendue après 3 ans de la date de début :", troisAnsApres);
        //  // Vérifier si la date de fin est égale à 3 ans après la date de début
        //  if (dateFinProc.getTime() !== troisAnsApres.getTime()) {
         //  this.toastrService.danger('Date Fin Qualification doit etre 3 ans apres la  date debut !!!', 'Erreur');
         if (dateFinProc <= datedebProc) {
          this.toastrService.danger('Date Fin  doit etre supérieur à la date debut !!!', 'Erreur');
        
        }else{
   
       console.log(this.modProcede);
        this.modProcede.procede = this.currentProcede;
        this.modProcede.code=this.currentProcede.code;
        this.modProcede.code=this.currentProcede.nom;
        const formData = new FormData();
        formData.append('modprocede', new Blob([JSON.stringify(this.modProcede)], {
          type: 'application/json'
        }));
        if (this.lf.length > 0) {
                    Array.from(this.lf).forEach(file => {
                     formData.append('files', file);
                    });
        this.service.addModProcede(formData).subscribe(
         (unite1) => {
           console.log('Mise à jour added successfully:', unite1);
            this.files = null; // Réinitialiser les fichiers
            this.modProcede.date_fin = ""; 
            this.modProcede.date_init = "";
            this.modProcede.rev = ""; 
            this.modProcede.ref = ""; 
            this.modProcede.designation = ""; 
            //
            Swal.fire({
              title: 'Succès!',
              text: 'Modifiecation du PS  a été effectué avec succès.',
              icon: 'success',
              confirmButtonColor: '#0CA417',
              confirmButtonText: 'OK'
            });
         },
         (error) => {
           console.error('Error adding site:', error);
           this.toastrService.danger('Merci de contacter le service IT ', 'Erreur');
         }
  
       );}
     
     }}
  
  }
