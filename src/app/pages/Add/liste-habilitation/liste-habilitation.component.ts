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
      procede: {
        title: 'Procédé Speciale',
  
          type: 'string',
          valuePrepareFunction: (procede) => { return (procede?.nom); },
          filterFunction: (procede, val) => {
            if (procede != null) {
              const activiteNomLowerCase = procede.nom.toLowerCase();
              const valLowerCase = val.toLowerCase();
              return activiteNomLowerCase.indexOf(valLowerCase) !== -1 || !val;
            }
            return false;
          }
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
      position: 'right',
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
  console.log("Info header  :",this.currentuser )    
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
 //  this.LoadUserByHabilitationId();
  }



  LoadHabilitation() {
    this.service.getHabilitation().subscribe(liste => {
      console.log("test");
      this.listeHabilitation=liste.reverse();
      this.source = new LocalDataSource(this.listeHabilitation) 
      console.log(liste);
    });
  }
 
  LoadFormationByHabilitation() {
    this.service.getFormationByDernierDate(this.habilitation1.id).subscribe(liste => {
      console.log("test");
      this.listeFormation=liste.reverse();
      this.sourceFormation = new LocalDataSource(this.listeFormation)
      console.log(liste); 
    });
  }

  createHabilitation(event: any): void {
    const habilitation1= event.data;
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
      this.dialogRef = this.dialogservice.open(this.dialogEdit, { context: { habilitation1: this.habilitation1 } });

      console.log(liste);
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
    //ajout de nouveau formation 

    SaveFormation(ref: NbDialogRef<any>): void {
      console.log(this.selectedcollab[0].id)
      if (!this.formation.date_fin || !this.formation.date_init ||!this.selectedcollab||!this.files) {
         this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
         return;
       }
     console.log(this.formation);
     if (this.selectedcollab) {
      // const selectedUserId = this.selectedUsers[i][0]; // Récupérer l'ID de l'utilisateur sélectionné
      // console.log(selectedUserId)
      //  const user: Utilisateur = { id: selectedUserId.id};
      //  formation.utilisateur = user; 
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
         console.log('formation added successfully:', unite1);
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

   //fermeture de boite de dialogue 
   close(ref: NbDialogRef<any>): void{
    ref.close();
   }

   //telechargement des fichiers des formations

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


//Modifier liste  Habilitaion

    modifier(ref: NbDialogRef<any>): void {
      console.log(ref)
      this.habilitation1.titre= this.habilitation1.titre
      this.habilitation1.ref= this.habilitation1.ref
      this.habilitation1.etatactive= this.habilitation1.etatactive
      this.habilitation1.procede= this.habilitation1.procede
    
      this.service.updateHabilitation(this.habilitation1.id,this.habilitation1).subscribe(
        () => {
          console.log('User edited successfully:');
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
     console.log(this.modFormation);
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
         console.log('Mise à jour added successfully:', unite1);
        
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

    // getDateFormation(id:number):string{
    //   this.service.getModFormationByFormationId(id).subscribe(modif => {
    //     this.ListeModif = modif;
    //     this.nb_modif=this.ListeModif.length
    //     console.log("les modif  actuel est ",  this.ListeModif) 
    //     if(this.nb_modif==0) {
    //       this.service.getFormationById(id).subscribe(form => {
    //         this.currentFormation = form;
    //         console.log("current Formation actuel est ",  this.currentFormation) 
    //         console.log( this.currentFormation.date_init.toString())
    //        });
        
    //        this.resultat=this.currentFormation.date_init.toString()
    //        console.log(this.resultat)
    //     }else{
    //       this.resultat= this.ListeModif.slice(-1)[0].date_init.toString()
    //       console.log(this.resultat)
    //     }
    //    });
    //    return this.resultat 
    // }

    // async fetchDateFormation(id: number): Promise<string> {
    //   try {
    //     const dateFormation = await this.getDateFormation(id);
    //     return dateFormation;
    //   } catch (error) {
    //     console.error('Erreur lors de la récupération de la date de formation:', error);
    //     return ''; // Retourne une chaîne vide en cas d'erreur
    //   }
    // }

    // getDateFormation(id: number): Promise<string> {
    //   return new Promise<string>((resolve, reject) => {
    //     this.service.getModFormationByFormationId(id).subscribe(
    //       modif => {
    //         this.ListeModif = modif;
    //         this.nb_modif = this.ListeModif.length;
    //         console.log("Les modifications actuelles sont ", this.ListeModif);
    //         if (this.nb_modif === 0) {
    //           this.service.getFormationById(id).subscribe(
    //             form => {
    //               this.currentFormation = form;
    //               console.log("La formation actuelle est ", this.currentFormation);
    //               const dateInitString = this.currentFormation.date_init ? this.currentFormation.date_init.toString() : '';
    //               resolve(dateInitString);
    //             },
    //             error => reject(error)
    //           );
    //         } else {
    //           const dateInitString = this.ListeModif.slice(-1)[0].date_init.toString();
    //           console.log(dateInitString);
    //           resolve(dateInitString);
    //         }
    //       },
    //       error => reject(error)
    //     );
    //   });
    // }
    getDateFormation(id: number): Observable<string> {
      return this.service.getModFormationByFormationId(id).pipe(
        switchMap(modif => {
          this.ListeModif = modif;
          this.nb_modif = this.ListeModif.length;
          console.log("Les modifications actuelles sont ", this.ListeModif);
          if (this.nb_modif === 0) {
            return this.service.getFormationById(id).pipe(
              map(form => {
                this.currentFormation = form;
                console.log("La formation actuelle est ", this.currentFormation);
                return this.currentFormation.date_init ? this.currentFormation.date_init.toString() : '';
              })
            );
          } else {
            const dateInitString = this.ListeModif.slice(-1)[0].date_init.toString();
            console.log(dateInitString);
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
        console.log(selectedUserId)
        this.service.getUserById(selectedUserId.id).subscribe(procede => {
        this.user = procede;
        console.log("le user actuel est ",procede)
        this.UserNom=this.user.username
        this.UserPrenom=this.user.prenom
        console.log(this.UserNom , this.UserPrenom)
          
        });
      }}
  
}
