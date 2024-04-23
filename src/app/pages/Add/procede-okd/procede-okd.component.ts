import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CrudService } from '../../../Service/crud.service';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Procede } from '../../../Model/Procede.model';
import { OKD } from '../../../Model/OKD.model';
import Swal from 'sweetalert2';
import { CarteControle } from '../../../Model/CarteControle.model';
import { Critere } from '../../../Model/Critere.model';
import { LocalDataSource } from 'ng2-smart-table';
import { Habilitation } from '../../../Model/Habilitation.model';
import { Formation } from '../../../Model/Formation.model';
import { Utilisateur } from '../../../Model/Utilisateur.model';
import { Files } from '../../../Model/Files.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'ngx-procede-okd',
  templateUrl: './procede-okd.component.html',
  styleUrls: ['./procede-okd.component.scss']
})
export class ProcedeOKDComponent implements OnInit {

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
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    pager: {
      display: true,
      perPage: 5, // Limiter le nombre de lignes par page à 5
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
        title: 'Date_init',
        type: 'String',
      },
      date_fin: {
        title: 'Titre',
        type: 'string',
      },
    
     
    },
  };
 //Declaration SettingsCarte
 SettingsCarte = {
  noDataMessage: 'Liste des cartes de Controle est vide',
  mode: "external",
  actions: {
    add:false,
    edit: true,
    delete: true,
    position: 'right',
    page:5



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
  pager: {
    display: true,
    perPage: 5, // Limiter le nombre de lignes par page à 5
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
    min: {

      title: 'Valeur Min',

      type: 'string',

    },
    max: {

      title: 'Valeur Max',

      type: 'string',

    },

    nb_valeur: {

      title: 'Nb Valeur',

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
    add:false,
    edit: true,
    delete: true,
    position: 'right',



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
  pager: {
    display: true,
    perPage: 5, // Limiter le nombre de lignes par page à 5
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
    add:false,
    edit: true,
    delete: true,
    position: 'right',



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
  pager: {
    display: true,
    perPage: 5, // Limiter le nombre de lignes par page à 5
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
  pager: {
    display: true,
    perPage: 5, // Limiter le nombre de lignes par page à 5
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

  //Declaration sources 
  sourceCarte :LocalDataSource = new LocalDataSource();
  //Declaration sources 
  sourceOKD :LocalDataSource = new LocalDataSource();
  //Declaration sources 
  sourceListe :LocalDataSource = new LocalDataSource();

  sourceCritere :LocalDataSource = new LocalDataSource();
  sourceFormation :LocalDataSource = new LocalDataSource();

  @ViewChild('CC', { static: true }) accordionCC;
  @ViewChild('OKD', { static: true }) accordionOKD;
  @ViewChild('Critere', { static: true }) accordion;
  mydate=new Date()
  listeProcede: Procede[]=[]
  procede:Procede =new Procede()
  okd:OKD =new OKD()
  newFormation:Formation =new Formation()
  formation:Formation =new Formation()
  formation1:Formation =new Formation()
  carte:CarteControle =new CarteControle()
  habilitation:Habilitation =new Habilitation()
  habilitation1:Habilitation =new Habilitation()
  listeUser:Utilisateur[]=[]
  listeUser1:Utilisateur[]=[]
  listeUserNotInListe:Utilisateur[]=[]

  criteres: Critere[] = [];
  showFunctionInput: boolean = false;
  Listecriteres: Critere[] = [];
  listeCc:CarteControle[]=[]
  carte1:CarteControle=new CarteControle()

  critere:Critere=new Critere()
  critere1:Critere=new Critere()
  newCritere:Critere=new Critere()

  okd1:OKD =new OKD()
  listeOKD:OKD[]=[]
  listeFormation:Formation[]=[]
  listeOKDExtraction:OKD[]=[]
  listeHabilitationExtractés:Habilitation[]=[]
  listeHabilitation:Habilitation[]=[]
  habilitationfinal:Habilitation=new Habilitation()
  okdFinale:OKD =new OKD()
  id:any
  selectedCollab:any
  
  nb_habilistation:number=0
  nb_OKD:number=0
  r: boolean = true;
  files:any[] = [];
  listfiles: LocalDataSource = new LocalDataSource();
  f: Files = new Files(); // Assurez-vous que la classe File est définie correctement
  lf: any[] = [];
  lfUpdate: any[] = [];
  formations: Formation[] = [];
  showSmartTable: boolean = false;
  showSmartTable1: boolean = false;

  selectedUsers: Utilisateur[] = [];
  listefin: Utilisateur[] = [];
  user:Utilisateur=new Utilisateur()
  UserNom:String
  UserPrenom:String
  UserNom1:String
  UserPrenom1:String
 selectedUserDetails: { nom: string, prenom: string }[] = [];

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
  
  dropdownSettings = {};
  constructor( private service:CrudService,
    private route:Router,
    private dialogservice: NbDialogService,
    private toastrService: NbToastrService){ }

  ngOnInit(): void {
    this.service.getProcede().subscribe(procede => {
      this.listeProcede = procede;
      console.log("la liste des procédés : ",this.listeProcede)

      this.procede = this.listeProcede.slice(-1)[0];
      console.log("Le dernier élément de la liste : ",  this.procede);  
      console.log(this.procede.id)
      this.id=this.procede.id
      console.log("testtttttttttt",this.id)
      this.getCarteByProcedeId(this.id)
      this.getOKDByProcedeId(this.id)
      this.getHabilitationByProcedeId(this.id)
      this.getMOD()
    });
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'matricule',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
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
      this.nb_OKD=this.listeOKD.length
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
      this.nb_habilistation=  this.listeHabilitation.length
      console.log(this.listeHabilitation, this.nb_habilistation);
      this.sourceListe= new LocalDataSource(this.listeHabilitation); 
    });
  }
  LoadFormationByHabilitation(id:any) {
    this.service.getFormationByDernierDate(id).subscribe(liste => {
      console.log("test");
      this.listeFormation=liste;
      this.sourceFormation = new LocalDataSource(this.listeFormation) 
      console.log(liste);
      
    const usedUserIds = this.listeFormation.map(formation => formation.utilisateur.id);
    this.listefin=this.listeUser.filter(user => !usedUserIds.includes(user.id));
      console.log("liste useer final n'est pas inclus dans formations :",this.listefin)
    });
  }
  toggleCC() {
    this.accordionCC.toggle();
  }
  toggleOKD() {
    this.accordionOKD.toggle();
  }
  toggleCritere() {
    this.accordion.toggle();
  }
//Ajout OKD 
resetFields(): void {
  this.okd.nom = "";
  this.okd.designation = "";
  this.okd.ref = "";
  this.mydate = new Date(); // Réinitialiser la date également
}

SaveOKD(): void {
  if (!this.okd.nom || !this.okd.designation||!this.okd.ref) {
    // Afficher un toast d'erreur
    this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
    return;
  }
    this.okd.procede=this.procede,
    this.okd.date_init=this.mydate.toISOString().slice(0,10)
    console.log(this.okd);
    this.service.addOKD(this.okd).subscribe(
    (site1) => {
      console.log('Check-List "OK DEMARRAGE" added successfully:', site1);
      Swal.fire({
        title: 'Succès!',
        text: 'L\'ajout a été effectué avec succès.',
        icon: 'success',
        confirmButtonColor: '#0CA417',
        confirmButtonText: 'OK'
      });
      this.route.navigate(["/pages/ProcedeOKD"]);
      this.resetFields();
      this.showSmartTable = true;
    },
    (error) => {
      console.error('Error adding site:', error);
      this.toastrService.danger('Erreur lors de l\'ajout du site', 'Erreur');
  
    }
  );
}

//Ajout Carte Controle 
resetFieldsCC(): void {
  this.carte.nom = "";
  this.carte.fonction = "";
  this.carte.min = "";
  this.carte.max = "";
  this.carte.ref = "";
  this.carte.nb_valeur = 0;
  this.habilitation.ref="";
  this.habilitation.titre="";
  this.okd.nom=""
  this.okd.ref=""
  this.okd.designation=""
}
checkInput() {
  // Vérifiez l'état du combobox pour déterminer si l'input de la fonction doit être affiché
  this.showFunctionInput = this.showFunctionInput;

}


SaveCC(): void {
  console.log(this.carte);
  if (!this.carte.nom||!this.carte.ref||!this.carte.nb_valeur||!this.carte.max||!this.carte.min) {
    // Afficher un toast d'erreur
    this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
    return;
  }
  const min = parseInt(this.carte.min.toString());
  const max = parseInt(this.carte.max.toString());
  console.log("min : ",min, "max : " ,max)
  if (min >= max) {
    this.toastrService.danger('La valeur de min doit être inférieure à la valeur de max', 'Erreur');
    return;
  }
  if(this.carte.fonction){
    const fonctionRegExp = /^(\((V\d+|\d+)([+\-*\/](V\d+|\d+))*\)|V\d+|\d+)([+\-*\/](\((V\d+|\d+)([+\-*\/](V\d+|\d+))*\)|V\d+|\d+))*$/;


    // Vérification si la fonction correspond au modèle spécifié
    if (!fonctionRegExp.test(this.carte.fonction)) {
      this.toastrService.danger('Veuillez vérifier votre fonction. Elle doit être sous la forme : V1+V2*V3, etc.', 'Erreur');
      return;
    }
  
    const fonction = this.carte.fonction;
  
    const match = fonction.match(/V(\d+)/g);
    if (match) {
      const dernierNombre = match[match.length - 1];
      const nombreMaxDeValeurs = parseInt(dernierNombre.substring(1), 10);
      const nbValeurs = this.carte.nb_valeur || 0;
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

  this.carte.procede=this.procede,
  console.log(this.carte);
  this.service.addCC(this.carte).subscribe(
  (site1) => {
    console.log('Carte De Controle added successfully:', site1);
    Swal.fire({
      title: 'Succès!',
      text: 'L\'ajout a été effectué avec succès.',
      icon: 'success',
      confirmButtonColor: '#0CA417',
      confirmButtonText: 'OK'
    });
    this.route.navigate(["/pages/ProcedeOKD"]);
    this.resetFieldsCC();
    this.getCarteByProcedeId(this.procede.id)
  },
  (error) => {
    console.error('Error adding site:', error);
    this.toastrService.danger('Erreur lors de l\'ajout du site', 'Erreur');

  });
}

//Ajout Des Critéres :
addCritere() {
  this.criteres.push({});
}

removeCritere(index: number) {
  this.criteres.splice(index, 1);
}

SaveCriteres() {
  // Logique pour sauvegarder les informations des critères
  // const EmptyCriteres = this.criteres.filter(critere => {
  //   if((critere.nom && critere.type)||(critere.type === 'valeur' && (!critere.min && !critere.max))) {
  //     return critere.nom.trim() === '' && critere.type.trim() === '';
  //   } else {
  //     return true;
  //   }
  // });
  // console.log(EmptyCriteres.length);
  // if (EmptyCriteres.length !== 0) {
  //   this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
  //   return;
  // }

  for (let critere of this.criteres) {
    if (!critere.nom || !critere.type || (critere.type === 'valeur' && (!critere.min || !critere.max))) {
      this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
      return;
    }
    if (critere.type === 'valeur') {
      const min = parseInt(critere.min.toString());
      const max = parseInt(critere.max.toString());
      console.log("min : ",min, "max : " ,max)
      if (min >= max) {
        this.toastrService.danger('La valeur de min doit être inférieure à la valeur de max', 'Erreur');
        return;
      }
    }
  }
  //extraction du dernier okd enregistrer   
  this.service.getOKD().subscribe(procede => {
    this.listeOKDExtraction = procede;
    console.log("la liste des okds : ",this.listeOKDExtraction)

    this.okdFinale = this.listeOKDExtraction.slice(-1)[0];
    console.log("Le dernier élément de la liste : ",  this.okdFinale);  
    console.log(this.okdFinale.id)
  console.log("Critères saved: ", this.criteres);
  for(let critere of this.criteres){
    critere.okd=this.okdFinale,
    console.log(critere);
    this.service.addCritere(critere).subscribe(
    (site1) => {
      console.log('La Liste Des Critéres added successfully:', site1);
    },
    (error) => {
      console.error('Error adding site:', error);
      this.toastrService.danger('Erreur lors de l\'ajout du site', 'Erreur');
  
    }
  );
  Swal.fire({
    title: 'Succès!',
    text: 'L\'ajout a été effectué avec succès.',
    icon: 'success',
    confirmButtonColor: '#0CA417',
    confirmButtonText: 'OK'
  });
  this.criteres = [];
  this.route.navigate(["/pages/ProcedeOKD"]);
  this.resetFieldsCC();
  this.getOKDByProcedeId(this.procede.id)
  this.showSmartTable = false;

  }
})
   
}
SaveHabilitation(): void {
  if (!this.habilitation.titre || !this.habilitation.ref) {
    // Afficher un toast d'erreur
    this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
    return;
  }
    this.habilitation.procede=this.procede,
 
    this.service.addHabilitation(this.habilitation).subscribe(
    (site1) => {
      console.log('la liste d\'habilitation added successfully:', site1);
      Swal.fire({
        title: 'Succès!',
        text: 'L\'ajout a été effectué avec succès.',
        icon: 'success',
        confirmButtonColor: '#0CA417',
        confirmButtonText: 'OK'
      });
      this.route.navigate(["/pages/ProcedeOKD"]);
      this.getHabilitationByProcedeId(this.procede.id)
      this.showSmartTable1 = true;
    },
    (error) => {
      console.error('Error adding site:', error);
      this.toastrService.danger('Erreur lors de l\'ajout du site', 'Erreur');
  
    }
  );
}

//Ajout Des Critéres :
addFormation() {
  this.formations.push(new Formation());
}

removeFormation(index: number) {
  this.formations.splice(index, 1);
}
updateEndDate1(index: number): void {
  if (this.formations[index].date_init) {
    const dateInit = new Date(this.formations[index].date_init.toString());
    const dateFin = new Date(dateInit.getFullYear() + 1, dateInit.getMonth(), dateInit.getDate());
    this.formations[index].date_fin = dateFin.toISOString().slice(0, 10);
  }
}

onDateInitChange1(index: number): void {
  this.updateEndDate1(index);
}

onSelectUser(event: any, index: number) {
  this.selectedUsers[index] = event; // Stocker l'utilisateur sélectionné dans la liste selectedUsers
}

// userDetail(index: number): void {
//   if (this.selectedUsers[index]) {
//     const selectedUserId = this.selectedUsers[index][0]; // Récupérer l'ID de l'utilisateur sélectionné
//     console.log(selectedUserId)
//     this.service.getUserById(selectedUserId.id).subscribe(procede => {
//     this.user = procede;
//     console.log("le user actuel est ",procede)
//     this.UserNom=this.user.username
//     this.UserPrenom=this.user.prenom
//     console.log(this.UserNom , this.UserPrenom)
      
//     });
//   }
// }
userDetail(index: number): void {
  if (this.selectedUsers[index]) {
    const selectedUserId = this.selectedUsers[index][0]; // Récupérer l'ID de l'utilisateur sélectionné
    console.log(selectedUserId);
    this.service.getUserById(selectedUserId.id).subscribe(user => {
      this.selectedUserDetails[index] = { nom: user.username, prenom: user.prenom };
      console.log("le user actuel est ", user);
    });
  }
}



SaveFormation() {
  console.log(this.selectedUsers)
  console.log(this.formations)
 // Logique pour verifier que les collaborateurs existent une seule fois dans la liste des habilitations 
  const uniqueSelectedUsers = Array.from(new Set(this.selectedUsers.map(user => user[0].id)));
  if (uniqueSelectedUsers.length !== this.selectedUsers.length) {
    this.toastrService.danger('Un collaborateur ne peut être sélectionné qu\'une seule fois.', 'Erreur');
    return;
  }
  // Logique pour sauvegarder les informations des formations
  const EmptyCriteres = this.formations.filter(formation => {
    if (formation.date_init && formation.date_fin &&this.selectedUsers) {
      return formation.date_init.trim() === '' && formation.date_fin.trim() === '';
    } else {
      return true;
    }
  });

  if (EmptyCriteres.length !== 0) {
    this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
    return;
  }

  // Extraction du dernier okd enregistré
  this.service.getHabilitation().subscribe(procede => {
    this.listeHabilitationExtractés = procede;
    this.habilitationfinal = this.listeHabilitationExtractés.slice(-1)[0];

    // Parcourir les formations et les fichiers simultanément
    for (let i = 0; i < this.formations.length && i < this.lf.length; i++) {
      const formation = this.formations[i];
      const file = this.lf[i];
      console.log("l'user correspondant pour la formation :",i,this.selectedUsers[i]);
     
      // Associer l'utilisateur sélectionné à la formation
      const selectedUserId = this.selectedUsers[i][0]; // Récupérer l'ID de l'utilisateur sélectionné
      console.log(selectedUserId)
       const user: Utilisateur = { id: selectedUserId.id};
       formation.utilisateur = user; 
      // console.log(formation.utilisateur)
      formation.habilitation = this.habilitationfinal;
      console.log("formation ",i,formation)
      // Créer un nouvel objet FormData pour chaque formation
      const formData = new FormData();
      formData.append('formation', new Blob([JSON.stringify(formation)], {
        type: 'application/json'
      }));

      // Associer le fichier à la formation
      formData.append('files', file);
      console.log("formation final",formation)
      // Envoyer la formation avec son fichier associé au serveur
      this.service.addFormation(formData).subscribe(
        (site1) => {
          console.log('Formation added successfully:', site1);
        },
        (error) => {
          console.error('Error adding formation:', error);
          this.toastrService.danger('Erreur lors de l\'ajout de la formation', 'Erreur');
        }
      );
    }

    Swal.fire({
      title: 'Succès!',
      text: 'L\'ajout a été effectué avec succès.',
      icon: 'success',
      confirmButtonColor: '#0CA417',
      confirmButtonText: 'OK'
    });


    this.route.navigate(['/pages/ProcedeOKD']);
    this.formations=[];
    this.files=[];
  });
}


// SaveFormation() {
//   // Logique pour sauvegarder les informations des critères
//   const EmptyCriteres = this.formations.filter(formation => {
//     if (formation.date_init && formation.date_fin&& formation.utilisateur) {
//       return formation.date_init.trim() === '' && formation.date_fin.trim() === '';
//     } else {
//       return true;
//     }
//   });
//   console.log(EmptyCriteres.length);
//   if (EmptyCriteres.length !== 0) {
//     this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
//     return;
//   }
//   //extraction du dernier okd enregistrer   
//   this.service.getHabilitation().subscribe(procede => {
//     this.listeHabilitationExtractés = procede;
//     console.log("la liste des Habilitation Extractés : ",this.listeHabilitationExtractés)

//     this.habilitationfinal = this.listeHabilitationExtractés.slice(-1)[0];
//     console.log("Le dernier élément de la liste habilitation final : ",  this.habilitationfinal);  
//     console.log(this.habilitationfinal.id)
//   console.log("Critères saved: ", this.formations);

//   const formData = new FormData();

//   for(let formation of this.formations){
//     formation.habilitation=this.habilitationfinal,
//     console.log(formation);
//     formData.append('formation', new Blob([JSON.stringify(formation)], {
  
//       type: 'application/json'
//         }));
//     if (this.lf.length > 0) {
//           Array.from(this.lf).forEach(file => {
//            formData.append('files', file);
//           });
//           this.service.addFormation(formData).subscribe(
//             (site1) => {
//               console.log('formation added successfully:', site1);
//             },
//             (error) => {
//               console.error('Error adding site:', error);
//               this.toastrService.danger('Erreur lors de l\'ajout du site', 'Erreur');
          
//             }
//           );
//   }
//   Swal.fire({
//     title: 'Succès!',
//     text: 'L\'ajout a été effectué avec succès.',
//     icon: 'success',
//     confirmButtonColor: '#0CA417',
//     confirmButtonText: 'OK'
//   });
//   this.criteres = [];
//   this.route.navigate(["/pages/ProcedeOKD"]);
//   this.resetFieldsCC();
//   this.getOKDByProcedeId(this.procede.id)
//   }
// })
   
// }



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

        this.getCarteByProcedeId(this.procede.id);



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

        this.getOKDByProcedeId(this.procede.id);



      },

        error => {
          this.toastrService.danger("Merci de contacter le service IT", 'Erreur');
         

        });

    }

  })

}

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

        this.getHabilitationByProcedeId(this.procede.id);
         },
          error => {
          this.toastrService.danger("Merci de contacter le service IT", 'Erreur');
        });

    }

  })

}
getCritereByOkdId(id:any){
  this.service.getCritereByOkdId(this.okd1.id).subscribe(liste => {
    console.log("test");
    this.Listecriteres=liste;
    this.sourceCritere = new LocalDataSource(this.Listecriteres) 
    console.log(liste);
  });
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

//supprision des Criteres
OnDeleteConfirmFormation(event) {
  this.formation= event.data;
  Swal.fire({

    title: 'Attention !',

    text: "Etes vous sûr de vouloir supprimer cette Habilitation ?",

    icon: 'warning',

    showCancelButton: true,

    confirmButtonColor: '#28a745',

    cancelButtonColor: '#dc3545',

    confirmButtonText: 'Oui, supprimer!'

  }).then((result) => {

    if (result.isConfirmed) {

      this.formation.etatactive = false;
      event.actif=false;
      this.service.updateCritere( this.formation.id,this.formation).subscribe(data => {
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
  console.log(this.listfiles)    
  this.files = event.target.files;
  // this.lf.push(this.files);
  console.log(this.lf)
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
             this.carte1.procede=this.procede
             this.service.updateCC(this.carte1.id,this.carte1).subscribe(
               () => {
                 console.log('Carte edited successfully:');
                 this.getCarteByProcedeId(this.procede.id);
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
             this.okd1.procede=this.procede
             this.service.updateOKD(this.okd1.id,this.okd1).subscribe(
               () => {
                 console.log('okd1 edited successfully:');
                 this.getOKDByProcedeId(this.procede.id);
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
    if (!this.newCritere.type || !this.newCritere.nom||(this.newCritere.type === 'valeur' && (!this.newCritere.min || !this.newCritere.max))) {
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

  //Modifier Liste Habilitaion 
        //Edite Site 
        editHabilitation(event: any): void {
          const habilitation1 = event.data;
          this.habilitation1 = { ...habilitation1 };
          this.dialogRef3 = this.dialogservice.open(this.dialogEditHabilitation, { context: { habilitation1: this.habilitation1 } });
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
          });
        }
              
            //Open model edite  :
            modifierHabilitation(ref: NbDialogRef<any>): void {
             this.habilitation1.ref= this.habilitation1.ref
             this.habilitation1.titre= this.habilitation1.titre
             this.habilitation1.procede=this.procede
             this.service.updateHabilitation(this.habilitation1.id,this.habilitation1).subscribe(
               () => {
                 console.log('habilitation1 edited successfully:');
                 this.getHabilitationByProcedeId(this.procede.id);
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
           

   //Ajout de nouveau Formation 
   addFor(dialog: TemplateRef<any>) {
  
    this.newFormation= new Formation();
  
    this.dialogservice.open(dialog);
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

    userDetail1(index: number): void {
      if (this.selectedCollab) {
        const selectedUserId = this.selectedCollab[0]; // Récupérer l'ID de l'utilisateur sélectionné
        console.log(selectedUserId)
        this.service.getUserById(selectedUserId.id).subscribe(procede => {
        this.user = procede;
        console.log("le user actuel est ",procede)
        this.UserNom1=this.user.username
        this.UserPrenom1=this.user.prenom
        console.log(this.UserNom1 , this.UserPrenom1)
          
        });
      }}
SaveNewFormation(ref: NbDialogRef<any>): void {
       console.log(this.newFormation);
      if ( !this.newFormation.date_init ||!this.selectedCollab||!this.files) {
         this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
         return;
       }
     console.log(this.newFormation);
     if (this.selectedCollab) {

      const collabSelectionne: Utilisateur = { id: this.selectedCollab[0].id};
      this.newFormation.utilisateur = collabSelectionne;

      const habilitationSelectionne: Habilitation = { id: this.habilitation1.id };
      this.newFormation.habilitation = habilitationSelectionne;

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
          this.newFormation.date_fin = ""; 
          this.newFormation.date_init = ""; //
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


  uploadFiche(event) {
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
    console.log("lf update : ",this.lf)
    this.listfiles = new LocalDataSource(this.lf); 
    console.log(this.listfiles)    
    this.files = event.target.files;
    // this.lf.push(this.files);
  }
 
OnDeleteConfirmFor(event) {
      this.formation= event.data;
      Swal.fire({
  
        title: 'Attention !',
  
        text: "Etes vous sûr de vouloir supprimer cette Habilitation ?",
  
        icon: 'warning',
  
        showCancelButton: true,
  
        confirmButtonColor: '#28a745',
  
        cancelButtonColor: '#dc3545',
  
        confirmButtonText: 'Oui, supprimer!'
  
      }).then((result) => {
  
        if (result.isConfirmed) {
  
          this.formation.etatactive = false;
          event.actif=false;
          this.service.supprimerFormation(this.formation.id,this.formation).subscribe(data => {
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


    //Modification Critere :
        //Edite Site 


        editFormation(event: any): void {
          const formation1 = event.data;
          this.formation1 = { ...formation1 };
          this.dialogRef4 = this.dialogservice.open(this.dialogEditFormation, { context: { formation1: this.formation1 } });
         
         }
              
            //Open model edite  :
      modifierFormation(ref: NbDialogRef<any>): void {
             console.log(this.lf)
             this.formation1.date_fin= this.formation1.date_fin
             this.formation1.date_init= this.formation1.date_init
             this.formation1.utilisateur= this.formation1.utilisateur
             this.formation1.habilitation=this.formation1.habilitation
             this.formation1.habilitation=this.formation1.habilitation
             this.formation1.etatactive=this.formation1.etatactive 
             const formData = new FormData();
             formData.append('formation', new Blob([JSON.stringify(this.formation1)], {
               type: 'application/json'
             }));
             if (this.lf.length > 0) {
                         Array.from(this.lf).forEach(file => {
                          formData.append('files', file);
                         });
                         
             this.service.updateFormation(formData).subscribe(
               () => {
                 console.log('formation edited successfully:');
                 this.LoadFormationByHabilitation(this.habilitation1.id);
                 ref.close();
                 this.toastrService.success('Habilitation modifié avec succès', 'Succès', {
                   duration: 5000,
                     });       
               },
               error => {
         
                 console.error('Erreur Modification User: ', error);
                 this.toastrService.danger('Erreur lors du modification du User ,Contacter le service IT', 'Erreur');
               }
             );
           }}


         

          updateEndDateUpdate(): void {
            if (this.formation1.date_init) {
             
              const dateInit = new Date(this.formation1.date_init.toString());
              const dateFin = new Date(dateInit.getFullYear() + 1, dateInit.getMonth(), dateInit.getDate());
              this.formation1.date_fin = dateFin.toISOString().slice(0, 10);
            }
          }
        
          onDateInitChangeUpdate(): void {
            this.updateEndDateUpdate();
          } 
}
