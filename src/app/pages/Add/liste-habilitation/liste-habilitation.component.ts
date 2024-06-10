import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../../Service/crud.service';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Habilitation } from '../../../Model/Habilitation.model';
import Swal from 'sweetalert2';
import { Files } from '../../../Model/Files.model';
import { Formation } from '../../../Model/Formation.model';
import { Utf8AsciiBinaryEncoding } from 'crypto';
import { Utilisateur } from '../../../Model/Utilisateur.model';
import { HistoriqueFormationComponent } from '../historique-formation/historique-formation.component';
import { ModFormation } from '../../../Model/ModFormation.model';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ImprimerHabilitationComponent } from '../imprimer-habilitation/imprimer-habilitation.component';

@Component({
  selector: 'ngx-liste-habilitation',
  templateUrl: './liste-habilitation.component.html',
  styleUrls: ['./liste-habilitation.component.scss']
})
export class ListeHabilitationComponent implements OnInit {
  settings = {
    noDataMessage: 'Liste des Procédés Spéciaux est vide',

    mode: "external",
  
    actions: {
      add: false,
  
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
      titre: {
        title: 'Titre',
        type: 'string',
      },
      procedeNom: {
        title: 'Procédé Speciale',
          type: 'string',
      },
      id:{
        title: 'Imprimer',
        type: 'custom',
        filter: false,
        renderComponent: ImprimerHabilitationComponent, 
      }
     
    },
  };

  settingFormation = {
    noDataMessage: 'Liste des habilitations est vide',

    mode: "external",
  
    actions: {
      add: true,
  
      edit: true,
  
      delete: true,  
    //  position: 'right',
      disabled: {
        addButtonContent: '<i class="nb-plus"></i>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        deleteButtonContent: '<i class="fas fa-user-lock"></i>',
        custom: [
          { name: 'edit', title: '<i class="nb-edit"></i>' },
          { name: 'delete', title: '<i class="fas fa-user-lock"></i>' },
        ],
        condition: (row) => {
          return row.etatactive === false;
        },
      },
  
  
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
      deleteButtonContent: '<i class="fas fa-user-lock"></i>',
      confirmDelete: true,
    },
    pager: {
      display: true,
      perPage: 2, // Limiter le nombre de lignes par page à 5
    },
    columns: {
      id: {
        title: 'Historiques',
        type: 'custom',
        filter: false,
        renderComponent: HistoriqueFormationComponent, 
      },
      etatactive: {
        title: 'Etat',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          const etat =this.getEtat(row.etatactive);
           if(etat=="Activé"){
             return "<p class='text-success'>Activé</p>"
           }
          else{
            return "<p class='text-danger'>Désactivé</p>"
          }
        },
      },
      
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
  listeHabilitation:Habilitation[]=[]
  habilitation:Habilitation =new Habilitation()
  habilitation1:Habilitation =new Habilitation()
  source: LocalDataSource = new LocalDataSource();
  listeFormation:Formation[]=[]
  modFormation:ModFormation=new ModFormation()

  r: boolean = true;
  files:any[] = [];
  listfiles: LocalDataSource = new LocalDataSource();
  sourceFormation: LocalDataSource = new LocalDataSource();
  f: Files = new Files(); // Assurez-vous que la classe File est définie correctement
  lf: any[] = [];
  formations: Formation[] = [];
  formation:Formation=new Formation()
  editformation:Formation=new Formation()
  addformation:Formation=new Formation()
  currentFormation:Formation=new Formation()
  ListeModif:ModFormation[]=[]
  listeUser:Utilisateur[]=[]
  listeUser1:Utilisateur[]=[]
  listeUserNotInListe:Utilisateur[]=[]
  nb_modif:number=0
  resultat:string

  listeHabilitationExtractés:Habilitation[]=[]
  habilitationfinal:Habilitation=new Habilitation()
  selectedcollab:any
  user:Utilisateur=new Utilisateur()
  UserNom:String
  UserPrenom:String

  dialogRef:NbDialogRef<any>
  dialogedit:TemplateRef<any>
  @ViewChild('dialogEdit', { static: false }) dialogEdit: TemplateRef<any>;

  dialogRef1:NbDialogRef<any>
  dialogeditFormation:TemplateRef<any>
  @ViewChild('dialogEditFormation', { static: false }) dialogEditFormation: TemplateRef<any>;
  currentuser:any
  userConnecte:any
  currentuserUnite:any
  dropdownSettings = {};
  constructor( private service:CrudService,
    private route:Router,
    private toastrService: NbToastrService,
    private dialogservice: NbDialogService,) { }

  ngOnInit(): void {
//recupérer l'utilisateur connéctée :
this.userConnecte=localStorage.getItem("user")
this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur=>{
  this.currentuser=utilisateur    
})

  this.LoadHabilitation();
 //this. getMOD();
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



  LoadHabilitation() {
    this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur=>{
      this.currentuser=utilisateur
      this.currentuserUnite=this.currentuser.unite.id
      this.service.getHabilitationByUnite(this.currentuserUnite).subscribe(liste => {
        console.log(liste)
        this.listeHabilitation=liste.reverse();
        this.source = new LocalDataSource(this.listeHabilitation) 
      });
     })
   
  }
 
  LoadFormationByHabilitation() {
    this.service.getFormationByDernierDate(this.habilitation1.id).subscribe(liste => {
      this.listeFormation=liste.reverse();
      this.sourceFormation = new LocalDataSource(this.listeFormation)
    });
  }

  createHabilitation(event: any): void {
    const habilitation1= event.data;
    this.habilitation1 = { ...habilitation1 };
    this.service.getMOD().subscribe(users => {
      this.listeUser1 = users;
     
    });
    this.service.getFormationByDernierDate(this.habilitation1.id).subscribe(liste => {
     
      this.listeFormation=liste.reverse();
      
       //Eliminer la redondance des users  
      this.service.getAllUserByHabilitationId(this.habilitation1.id).subscribe(liste => {
       
        this.listeUser=liste.reverse();
       
      // Filtrer listeUser1 pour obtenir les utilisateurs qui ne sont pas dans listeUser
      this.listeUserNotInListe = this.listeUser1.filter(user1 => !this.listeUser.some(user => user.id === user1.id));

      
      });
      this.sourceFormation = new LocalDataSource(this.listeFormation) 
      this.dialogRef = this.dialogservice.open(this.dialogEdit, { context: { habilitation1: this.habilitation1 } });

    
    });
   }

   add(dialog: TemplateRef<any>) {
  
    this.addformation= new Formation();

    this.dialogservice.open(dialog);
    }

  

     //Supprimer des habilitations  
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
  
            this.LoadHabilitation();
             },
              error => {
              this.toastrService.danger("Merci de contacter le service IT", 'Erreur');
            });
  
        }
  
      })
  
    }
   
    //supprimer formation 
    OnDeleteConfirmFormation(event) {
      this.formation= event.data;
      Swal.fire({
  
        title: 'Attention !',
  
        text: "Etes vous sûr de vouloir modifier l'accés de cette Habilitation ?",
  
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
         // this.formation.etatactive = false;
          event.actif=false;
          this.service.supprimerFormation( this.formation.id,this.formation).subscribe(data => {
            this.toastrService.success("Modification d'accés avec succés", "Succés", {
              duration: 5000,
                });
  
            this.LoadFormationByHabilitation();
             },
              error => {
              this.toastrService.danger("Merci de contacter le service IT", 'Erreur');
            });
  
        }
  
      })
  
    }
  
    SaveFormation(ref: NbDialogRef<any>): void {
      if (!this.formation.date_fin || !this.formation.date_init ||!this.selectedcollab||!this.files) {
         this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
         return;
       }
     if (this.selectedcollab) {
     
      const collabSelectionne: Utilisateur = { id: this.selectedcollab[0].id};
      this.formation.utilisateur = collabSelectionne;

      const habilitationSelectionne: Habilitation = { id: this.habilitation1.id };
      this.formation.habilitation = habilitationSelectionne;
      this.formation.qualit_id=this.currentuser.id
      const formData = new FormData();
      formData.append('formation', new Blob([JSON.stringify(this.formation)], {
        type: 'application/json'
      }));
      if (this.lf.length > 0) {
                  Array.from(this.lf).forEach(file => {
                   formData.append('files', file);
                  });
      this.service.addFormation(formData).subscribe(
       (unite1) => {
          this.LoadFormationByHabilitation();
         ref.close(); // Fermer la boîte de dialogue
          // Réinitialiser les champs à vide
          this.selectedcollab = null; // Réinitialiser la sélection de collaborateur
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

   close(ref: NbDialogRef<any>): void{
    ref.close();
   }


    uploadFiles(event) {
      this.r = true;
      this.listfiles = new LocalDataSource();
      const element = event.currentTarget as HTMLInputElement;
      let fileList: FileList | null = element.files;
    
      if (fileList.length > 0) {
    
        const file: File = fileList[0];
    
    
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
    
      this.listfiles = new LocalDataSource(this.lf); 
   
      this.files = event.target.files;
   
    }


//Modifier liste  Habilitaion

    modifier(ref: NbDialogRef<any>): void {
     
      this.habilitation1.titre= this.habilitation1.titre
      this.habilitation1.ref= this.habilitation1.ref
      this.habilitation1.etatactive= this.habilitation1.etatactive
      this.habilitation1.procede= this.habilitation1.procede
    
      this.service.updateHabilitation(this.habilitation1.id,this.habilitation1).subscribe(
        () => {  
          this.LoadHabilitation();
          if (ref) {
            ref.close();
          }
          this.toastrService.success('Liste Habilitation modifié avec succès', 'Succès', {
            duration: 5000,
              });       
        },
        error => {
  
          console.error('Erreur Modification User: ', error);
          this.toastrService.danger('Erreur lors du modification du User ,Contacter le service IT', 'Erreur');
        }
      );
    }

    //Modifier formation :
    editFormation(event: any): void {
      const editformation= event.data;
      this.editformation = { ...editformation };
      this.dialogRef1 = this.dialogservice.open(this.dialogEditFormation, { context: { editformation: this.editformation } });
     }

     AddHistorique(ref: NbDialogRef<any>): void {
      if (!this.modFormation.date_fin || !this.modFormation.date_init||!this.files) {
         this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
         return;
       }
    
      this.modFormation.formation = this.editformation;
      this.modFormation.qualit_id=this.currentuser.id
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
        
        
         this.LoadFormationByHabilitation();
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

    updateEndDate(): void {
      if (this.formation.date_init) {
       
        const dateInit = new Date(this.formation.date_init.toString());
        const dateFin = new Date(dateInit.getFullYear() + 1, dateInit.getMonth(), dateInit.getDate());
        this.formation.date_fin = dateFin.toISOString().slice(0, 10);
      }
    }
  
    onDateInitChange(): void {
      this.updateEndDate();
    }

   

   

   
    getDateFormation(id: number): Observable<string> {
      return this.service.getModFormationByFormationId(id).pipe(
        switchMap(modif => {
          this.ListeModif = modif;
          this.nb_modif = this.ListeModif.length;
          if (this.nb_modif === 0) {
            return this.service.getFormationById(id).pipe(
              map(form => {
                this.currentFormation = form;
                return this.currentFormation.date_init ? this.currentFormation.date_init.toString() : '';
              })
            );
          } else {
            const dateInitString = this.ListeModif.slice(-1)[0].date_init.toString();
            return of(dateInitString);
          }
        }),
        catchError(error => {
          console.error('Erreur lors de la récupération de la date de formation:', error);
          return of(''); // Retourne une chaîne vide en cas d'erreur
        })
      );
    }
    
    
    getEtat(etatactive: boolean): string {
      if (etatactive==true) {
        return 'Activé';
      } else {
        return 'Désactivé';
      }
    }

    userDetail(index: number): void {
      if (this.selectedcollab) {
        const selectedUserId = this.selectedcollab[0]; // Récupérer l'ID de l'utilisateur sélectionné
        
        this.service.getUserById(selectedUserId.id).subscribe(procede => {
        this.user = procede;
      
        this.UserNom=this.user.username
        this.UserPrenom=this.user.prenom   
        });
      }}
  
}
