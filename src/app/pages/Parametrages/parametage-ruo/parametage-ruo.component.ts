import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { Activite } from './../../../Model/Activite.model';
import { Site } from './../../../Model/Site.model';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { CrudService } from '../../../Service/crud.service';
import { Unite } from '../../../Model/Unite.model';
import { Atelier } from '../../../Model/Atelier.model';
import { NbDialogRef, NbDialogService ,NbToastrService} from '@nebular/theme';
import { Utilisateur} from '../../../Model/Utilisateur.model';
import { Role } from '../../../Model/Role.model';
import Swal from 'sweetalert2';
@Component({
  selector: 'ngx-parametage-ruo',
  templateUrl: './parametage-ruo.component.html',
  styleUrls: ['./parametage-ruo.component.scss']
})
export class ParametageRUOComponent implements OnInit {
  
  @ViewChild('typedText') typedTextElement: ElementRef;
  
   settingsRUO = {
  
      noDataMessage: 'Liste des Collaborateurs UO est vide',
  
      mode: "external",
  
      actions: {
  
   
  
        add: true,
  
        edit: true,
  
        delete: true,
  
  
       // position: 'right',
  
   
  
      },
  
      add: {
  
   
  
        addButtonContent: '<i class="nb-person"></i>',
  
        createButtonContent: '<i class="nb-checkmark"></i>',
  
        cancelButtonContent: '<i class="nb-close"></i>',
  
        confirmCreate: true,
  
      },
  
      edit: {
  
        editButtonContent: '<i class="nb-edit"></i>',
  
        saveButtonContent: '<i class="nb-checkmark"></i>',
  
        cancelButtonContent: '<i class="nb-close"></i>',
  
        confirmSave: true,
  
      },
  
      delete: {
  
        deleteButtonContent: '<i class="nb-trash" style="color:red"></i>',
  
        confirmDelete: true,
  
      },
  
      columns: {
   
        matricule: {
  
          title: 'Matricule',
  
          type: 'string',
  
        },
  
        username: {
  
          title: 'Nom',
  
          type: 'string',
  
        },
  
        prenom: {
  
          title: 'Prenom',
  
          type: 'string',
  
        },
  
        email: {
  
          title: 'Email',
  
          type: 'string',
  
        },
        unite: {
  
          title: 'Unite',
  
          type: 'string',
          valuePrepareFunction: (unite) => { return (unite?.nom); },
          filterFunction: (unite, val) => {
            if (unite != null) {
              const activiteNomLowerCase = unite.nom.toLowerCase();
              const valLowerCase = val.toLowerCase();
              return activiteNomLowerCase.indexOf(valLowerCase) !== -1 || !val;
            }
            return false;
          }
        },
        role: {
  
          title: 'Role',
  
          type: 'string',
          valuePrepareFunction: (role) => { return (role?.nom); },
          filterFunction: (role, val) => {
            if (role != null) {
              const activiteNomLowerCase = role.nom.toLowerCase();
              const valLowerCase = val.toLowerCase();
              return activiteNomLowerCase.indexOf(valLowerCase) !== -1 || !val;
            }
            return false;
          }
        },
  
      }
    } 
   
    //Declaration sources 
    sourceRUO :LocalDataSource = new LocalDataSource();
    source :LocalDataSource = new LocalDataSource();
  
    selectedRole:any
    selectedUnite:any
    selectedActivite:any
    showActivites: boolean = false;
    nbrunite:number=0
    nbrAtel:number=0
    nbrAct:number=0
   
    site1= new Site()
    listeRole:Unite[]=[]
    unite:Unite[]=[]
    activite:Activite[]=[]
    listeUser :Utilisateur[]=[]
    listeRUO :Utilisateur[]=[]
    liste :Utilisateur[]=[]
    liste3:Unite[]=[]
    listeUnite:Unite[]=[]
    userFile:any
    message?:String
    imgURL:any
    image:any
    intitule :any;
    id:any;
    userConnecte:any
  
    dialogRef:NbDialogRef<any>
    dialogedit:TemplateRef<any>
    @ViewChild('dialogEdit', { static: false }) dialogEdit: TemplateRef<any>;
  
  
    user :Utilisateur=new Utilisateur()
    user1 :Utilisateur=new Utilisateur()
    role:Role=new Role()
    currentuser:any
    currentuserUnite:number
    constructor(
      private service:CrudService,
      private route:Router,
      private dialogservice: NbDialogService,
      private toastrService: NbToastrService
    
    ) {  }
    onRoleChange() {
      this.showActivites = this.selectedRole !== 2;
    }
  
     //Affichege Site 
     LoadUserRUO(){
      const role = localStorage.getItem("user");
      if(role=='RPUO'){
        this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur=>{
          this.currentuser=utilisateur
          this.currentuserUnite=this.currentuser.unite.id 
          this.service.getUserByUnit(this.currentuserUnite).subscribe(user=>{
            this.listeUser=user.reverse();
            this.sourceRUO = new LocalDataSource(this.listeUser) 
          })
        })
      }else if(role=='RPS'){
        this.service.getUser().subscribe(user=>{
          this.listeUser=user.reverse();
          this.sourceRUO = new LocalDataSource(this.listeUser) 
        })
      }   
      }
    
        
        //Affichege UNITE 
   getUnite(id:number){
    this.service.getUniteById(id).subscribe(unite=>{
    this.unite=unite
   
    })
    }
   
     //Open model Add  :
  
     create(dialog: TemplateRef<any>) {
  
      this.user= new Utilisateur();
  
      this.dialogservice.open(dialog);
  
    }


        //Edite Site 
modifier(event: any): void {
   const user1 = event.data;
   this.user1 = { ...user1 };
   this.dialogRef = this.dialogservice.open(this.dialogEdit, { context: { user1: this.user1 } });
  }
       
     //Open model edite  :
     modifierRUO(ref: NbDialogRef<any>): void {
      this.user1.role= this.user1.role
      this.user1.unite= this.user1.unite
      this.user1.activite_id= this.user1.activite_id
      this.service.updateUser(this.user1.id,this.user1).subscribe(
        () => {
         
          this.LoadUserRUO();
          ref.close();
          this.toastrService.success('Collaborateur modifié avec succès', 'Succès', {
            duration: 5000,
              });       
        },
        error => {
  
          console.error('Erreur Modification User: ', error);
          this.toastrService.danger('Erreur lors du modification du User ,Contacter le service IT', 'Erreur');
        }
      );
    }
  
    // Uplod de l'image 
    handleInputChange(input: any): void {
  
      const files = input.files;
  
      if (files && files.length > 0) {
  
        const file = files[0];
  
        const pattern = /image-*/;
  
        const reader = new FileReader();
        if (!file.type.match(pattern)) {
  
          return;
  
        }
        reader.onload = this.handleReaderLoaded.bind(this);
  
        reader.readAsDataURL(file);
  
      }
  
    }
    handleReaderLoaded(e: any): void {
      const reader = e.target;
      this.image = reader.result;
      this.user1.image=this.image
  
    }
 
  
    //supprision de RPUO 
    OnDeleteConfirm(event) {
          this.user= event.data;
          Swal.fire({
      
            title: 'Attention !',
      
            text: "Etes vous sûr de vouloir supprimer ce Responsable Unité  ?",
      
            icon: 'warning',
      
            showCancelButton: true,
      
            confirmButtonColor: '#3085d6',
      
            cancelButtonColor: '#d33',
      
            confirmButtonText: 'Oui, supprimer!'
      
          }).then((result) => {
      
            if (result.isConfirmed) {
      
              this.user.etatactive = false;
      
              event.actif=false;
      
              this.service.updateUser( this.user.id,this.user).subscribe(data => {
                this.toastrService.success("Suppression avec succés", "Succés", {
                  duration: 5000,
                    });
      
                this.LoadUserRUO();
      
       
      
              },
      
                error => {
                  this.toastrService.danger("Merci de contacter le service IT", 'Erreur');
                 
      
                });
      
            }
      
          })
      
        }
  
    //Gestion des utilisateurs 
    createCollab(dialog: TemplateRef<any>) {
  
      this.user= new Utilisateur();
  
      this.dialogservice.open(dialog);
  
    }
    SaveCollab(ref: NbDialogRef<any>): void {
      if (!this.user.username || !this.user.prenom  || !this.user.matricule ||!this.selectedUnite||!this.selectedRole) {
         this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
         return;
       }
     if (this.selectedUnite) {

      const roleSelectionne: Role = { id: this.selectedRole };
      this.user.role = roleSelectionne;
      this.user.mdp=this.user.matricule;
      const uniteSelectionne: Unite = { id: this.selectedUnite };
      this.user.unite = uniteSelectionne;
      this.user.activite_id=this.selectedActivite
      this.service.registerUser(this.user).subscribe(
       (unite1) => {
         this.selectedRole = null;
         this.selectedUnite = null;
         this.selectedActivite = null;
         this.LoadUserRUO();
         ref.close();
         this.toastrService.success('Collaborateur ajouté avec succès', 'Succès', {
           duration: 5000,
             });
       },
       (error) => {
         console.error('Error adding site:', error);
         this.toastrService.danger('Erreur lors de l\'ajout du nouvelle Unité', 'Erreur');
       }
     );
   }
   }
    SaveRUO(ref: NbDialogRef<any>): void {
    if (!this.user.username || !this.user.prenom  || !this.user.matricule ||!this.user.email ||!this.selectedUnite) {
       this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
       return;
     }
   if (this.selectedUnite) {
    const roleSelectionne: Role = { id:2 };
    this.user.role = roleSelectionne;
    this.user.mdp=this.user.matricule;
    const uniteSelectionne: Unite = { id: this.selectedUnite };
    this.user.unite = uniteSelectionne;
    this.service.registerUser(this.user).subscribe(
     (unite1) => {
       this.selectedUnite = null;
       this.LoadUserRUO();
       ref.close();
       this.toastrService.success('Collaborateur ajouté avec succès', 'Succès', {
         duration: 5000,
           });
     },
     (error) => {
       console.error('Error adding site:', error);
       this.toastrService.danger('Erreur lors de l\'ajout du nouvelle Unité', 'Erreur');
     }
   );
 }
 }
   loadActivites() {
    if (this.selectedUnite) {
       this.service.getActivitiesByUniteId(this.selectedUnite).subscribe(at=>{
         this.activite=at
     }) 
   }
   }
  
  
    ngOnInit(): void {
     //recuperation du user connecté :
     this.userConnecte=localStorage.getItem("user")
      this.LoadUserRUO();
      this.service.getRole().subscribe(roles => {
        this.listeRole=roles.filter(role=>role.id!=1 && role.id!=2);
        
      });
       this.service.getUnite().subscribe(unite=>{
       this.listeUnite=unite
     
    })
  
    }
   
  }
  