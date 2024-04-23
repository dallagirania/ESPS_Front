import { Activite } from './../../../Model/Activite.model';
import { Site } from './../../../Model/Site.model';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../../Service/crud.service';
import { Unite } from '../../../Model/Unite.model';
import { Atelier } from '../../../Model/Atelier.model';
import { NbDialogRef, NbDialogService ,NbToastrService} from '@nebular/theme';
import Swal from 'sweetalert2';

@Component({
  selector: 'ngx-parametage-site',
  templateUrl: './parametage-site.component.html',
  styleUrls: ['./parametage-site.component.scss']
})
export class ParametageSiteComponent implements OnInit {

 

@ViewChild('typedText') typedTextElement: ElementRef;

  // ngAfterViewInit() {

  //   this.typeTextEffect();

  // }

 

  // typeTextEffect() {

  //   const textElement = this.typedTextElement.nativeElement;

  //   const text = "Paramètres Travaux";

  //   let index = 0;

 

  //   function type() {

  //     if (index < text.length) {

  //       textElement.innerHTML += text.charAt(index);

  //       index++;

  //       setTimeout(type, 100);

  //     } else {

  //        index = 0;

  //     }

  //   }

 

  //   type();

  // }

  //Declaration Settings Activités

  settingsActivite = {

    noDataMessage: 'Liste des sites est vide',

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

      confirmCreate: true,

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

      designation: {

        title: 'Designation',

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

    }
  } 
  //Declaration SettingsUO

  settingsUo = {

    noDataMessage: 'Liste des Unités Opérationnelle est vide',

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

      confirmCreate: true,

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

      designation: {

        title: 'Designation',

        type: 'string',

      },

      site: {

        title: 'Site',

        type: 'string',
        valuePrepareFunction: (site) => { return (site?.nom); },
        filterFunction: (site, val) => {
          if (site != null) {
            const activiteNomLowerCase = site.nom.toLowerCase();
            const valLowerCase = val.toLowerCase();
            return activiteNomLowerCase.indexOf(valLowerCase) !== -1 || !val;
          }
          return false;
        }
      },

    }
  } 

   //Declaration SettingsAtelier

   settingsAtelier = {

    noDataMessage: 'Liste des Ateliers est vide',

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

      confirmCreate: true,

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

      designation: {

        title: 'Designation',

        type: 'string',

      },
      activite: {

        title: 'Activite',

        type: 'string',
        valuePrepareFunction: (activite) => { return (activite?.nom); },
        filterFunction: (activite, val) => {
          if (activite != null) {
            const activiteNomLowerCase = activite.nom.toLowerCase();
            const valLowerCase = val.toLowerCase();
            return activiteNomLowerCase.indexOf(valLowerCase) !== -1 || !val;
          }
          return false;
        }
      },



    }
  } 
 //Declaration SettingsSite
 settingsSite = {

  noDataMessage: 'Liste des sites est vide',

  mode: "external",

  actions: {
    add: true,
    edit: true,
    delete: true,
    details:true,
    position: 'right',



  },

  add: {



    addButtonContent: '<i class="nb-plus"></i>',

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

    designation: {

      title: 'Designation',

      type: 'string',

    },

  }
}

  //Declaration sources 
  sourceActivite :LocalDataSource = new LocalDataSource();
  sourceUO:LocalDataSource = new LocalDataSource();
  sourceAtelier:LocalDataSource = new LocalDataSource();
  sourceSite :LocalDataSource = new LocalDataSource();

  selectedSite:any
  selectedUnite:any
  selectedActivite:any
  selectedUn: any;

  nbrunite:number=0
  nbrAtel:number=0
  nbrAct:number=0
 
  site1= new Site()
  unite=new Unite()
  unite1=new Unite()
  activite1=new Activite()
  atelier=new Atelier()
  atelier1=new Atelier()
  liste :Site[]=[]
  listeSite :Site[]=[]
  liste1 :Site[]=[]
  liste2: Unite[]=[]
  liste3: Unite[]=[]
  listeActivite: Activite[]=[]
  listeActivite1: Activite[]=[]
  listeAct: Activite[]=[]
  listeAtelier: Atelier[]=[]
  listeUnite: Unite[]=[]

  userFile:any
  message?:String
  imgURL:any
  image:any
  intitule :any;
  id:any;


  dialogRef:NbDialogRef<any>
  dialogedit:TemplateRef<any>
  @ViewChild('dialogEdit', { static: false }) dialogEdit: TemplateRef<any>;

  dialogRef1:NbDialogRef<any>
  dialogeditUnite:TemplateRef<any>
  @ViewChild('dialogEditUnite', { static: false }) dialogEditUnite: TemplateRef<any>;

  dialogRef2:NbDialogRef<any>
  @ViewChild('dialogActivite', { static: false }) dialogActivite: TemplateRef<any>;

  dialogRef3:NbDialogRef<any>
  @ViewChild('dialogAtelier', { static: false }) dialogAtelier: TemplateRef<any>;




  site :Site=new Site()
  activite :Activite=new Activite()
  constructor(
    private service:CrudService,
    private route:Router,
    private dialogservice: NbDialogService,
    private toastrService: NbToastrService
  
  ) { }
   //Affichege Site 
   Loadsites(){
    this.service.getSite().subscribe(site=>{
    this.liste=site;
    this.listeSite=site;
    this.sourceSite = new LocalDataSource(this.liste) 
    })
    }
 
     //Affichege UNITE 
   LoadUnites(){
    this.service.getUnite().subscribe(unite=>{
    this.liste3=unite
    this.listeUnite=unite
    this.sourceUO = new LocalDataSource(this.liste3)
     
    })
    }

       //Affichege ACTIVITE 
   LoadActivites(){
    this.service.getActivite().subscribe(act=>{
    this.listeActivite=act
    this.listeActivite1=act
    this.sourceActivite = new LocalDataSource(this.listeActivite)
     
    })
    }
      //Affichege Atelier 
   LoadAteliers(){
    this.service.getAtelier().subscribe(at=>{
    this.listeAtelier=at
    this.sourceAtelier = new LocalDataSource(this.listeAtelier)
     
    })
    }

    //ajout Atelier :
    loadActivites() {
      if (this.selectedUn) {
        this.service.getActivitiesByUniteId(this.selectedUn).subscribe(at=>{
          this.listeAct=at
          console.log(this.listeAct)
      }) 
    }
    }
 
   //Open model Add  :

   create(dialog: TemplateRef<any>) {

    this.site1 = new Site();

    this.dialogservice.open(dialog);

  }
  
    // ajout site
    SaveSite(ref: NbDialogRef<any>): void {
      if (!this.site1.nom || !this.site1.designation||!this.site1.ref) {
        // Afficher un toast d'erreur
        this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
        return;
      }
      console.log(this.site1);
      this.service.addSite(this.site1).subscribe(
        (site1) => {
          console.log('Site added successfully:', site1);
          this.Loadsites();
          ref.close();
           // Afficher le toast
          this.toastrService.success('Site ajouté avec succès', 'Succès', {
          duration: 5000,
            });
        },
        (error) => {
          console.error('Error adding site:', error);
          this.toastrService.danger('Erreur lors de l\'ajout du site', 'Erreur');
      
        }
      );
    }


      //Edite Site 
      modifier(event: any): void {
        const site = event.data;
        this.site = { ...site };
        this.dialogRef = this.dialogservice.open(this.dialogEdit, { context: { site: this.site } });
      }
     
   //Open model edite  :
   modifierSite(ref: NbDialogRef<any>): void {
    this.service.updateSite(this.site.id,this.site).subscribe(
      () => {
        console.log('Site edited successfully:');
        this.Loadsites();
        ref.close();
        this.toastrService.success('Site modifié avec succès', 'Succès', {
          duration: 5000,
            });
           
      },
      error => {

        console.error('Erreur Modification sites: ', error);
        this.toastrService.danger('Erreur lors du modification du site', 'Erreur');
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

    console.log('Image chargée:', this.image);
    this.site.image=this.image

  }

  //Ajout Unité 
    
   createUO(dialog: TemplateRef<any>) {

    this.unite1 = new Unite();

    this.dialogservice.open(dialog);

  }
  SaveUO(ref: NbDialogRef<any>): void {
    if (!this.unite1.nom || !this.unite1.designation||!this.unite1.ref||!this.selectedSite) {
      // Afficher un toast d'erreur
      this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
      return;
    }
    console.log(this.unite1);
    if (this.selectedSite) {
        const siteSelectionne: Site = { id: this.selectedSite };
        this.unite1.site=siteSelectionne,
        this.service.addUnite(this.unite1).subscribe(
      (unite1) => {
        console.log('unite added successfully:', unite1);
        this.LoadUnites();
        ref.close();
        this.toastrService.success('Unite ajouté avec succès', 'Succès', {
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

  //Ajout Activite    
    createAct(dialog: TemplateRef<any>) {

      this.activite1 = new Activite();
  
      this.dialogservice.open(dialog);
  
    }
    SaveAct(ref: NbDialogRef<any>): void {
      if (!this.activite1.nom || !this.activite1.designation||!this.activite1.ref||!this.selectedUnite) {
        // Afficher un toast d'erreur
        this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
        return;
      }
      console.log(this.activite1);
      if (this.selectedUnite) {
          const siteSelectionne: Site = { id: this.selectedUnite };
          this.activite1.unite=siteSelectionne,
          this.service.addActivite(this.activite1).subscribe(
        (site) => {
          console.log('activite added successfully:', site);
          this.LoadActivites();
          ref.close();
          this.toastrService.success('Activite ajouté avec succès', 'Succès', {
            duration: 5000,
              });
          
        },
        (error) => {
          console.error('Error adding activite:', error);
          this.toastrService.danger('Erreur lors de l\'ajout du nouveau activité', 'Erreur');
        }
      );
    }
    }

      //Ajout Activite    
    createAt(dialog: TemplateRef<any>) {

      this.atelier1 = new Atelier();
  
      this.dialogservice.open(dialog);
  
    }
    SaveAt(ref: NbDialogRef<any>): void {
      if (!this.atelier1.nom || !this.atelier1.designation||!this.atelier1.ref||!this.selectedActivite) {
        // Afficher un toast d'erreur
        this.toastrService.danger('Veuillez remplir tous les champs', 'Erreur');
        return;
      }
      console.log(this.atelier1);
      if (this.selectedActivite) {
          const ActSelectionne: Activite = { id: this.selectedActivite };
          console.log(ActSelectionne)
          this.atelier1.activite=ActSelectionne,
          this.service.addAtelier(this.atelier1).subscribe(
        (at) => {
          console.log('atelier added successfully:', at);
          this.LoadAteliers();
          ref.close();
          this.toastrService.success('Atelier ajouté avec succès', 'Succès', {
            duration: 5000,
              });
        },
        (error) => {
          console.error('Error adding atelier:', error);
          this.toastrService.danger('Erreur lors de l\'ajout du nouveau atelier', 'Erreur');
        }
      );
    }
    }

  //supprision de site 
      OnDeleteConfirm(event) {
        this.site= event.data;
        Swal.fire({
    
          title: 'Attention !',
    
          text: "Etes vous sûr de vouloir supprimer ce Site ?",
    
          icon: 'warning',
    
          showCancelButton: true,
    
          confirmButtonColor: '#3085d6',
    
          cancelButtonColor: '#d33',
    
          confirmButtonText: 'Oui, supprimer!'
    
        }).then((result) => {
    
          if (result.isConfirmed) {
    
            this.site.etatactive = false;
            event.actif=false;
            this.service.updateSite( this.site.id,this.site).subscribe(data => {
              this.toastrService.success("Suppression avec succés", "Succés", {
                duration: 5000,
                  });
    
              this.Loadsites();
    
     
    
            },
    
              error => {
                this.toastrService.danger("Merci de contacter le service IT", 'Erreur');
               
    
              });
    
          }
    
        })
    
      }
      

  //supprision de Unité 
   OnDeleteUnite(event: any) {
    this.unite= event.data;
        Swal.fire({
    
          title: 'Attention !',
    
          text: "Etes vous sûr de vouloir supprimer cet Unité  ?",
    
          icon: 'warning',
    
          showCancelButton: true,
    
          confirmButtonColor: '#3085d6',
    
          cancelButtonColor: '#d33',
    
          confirmButtonText: 'Oui, supprimer!'
    
        }).then((result) => {
    
          if (result.isConfirmed) {
    
            this.unite.etatactive = false;
            event.actif=false;
            this.service.updateUnite( this.unite.id,this.unite).subscribe(data => {
              this.toastrService.success("Suppression avec succés", "Succés", {
                duration: 5000,
                  });
    
              this.LoadUnites();
            },
    
              error => {
                this.toastrService.danger("Merci de contacter le service IT", 'Erreur');
               
    
              });
    
          }
    
        })
    
      }
  

    //supprision d'Activite 
    OnDeleteAct(event: any) {
    this.activite= event.data;
    Swal.fire({

      title: 'Attention !',

      text: "Etes vous sûr de vouloir supprimer cet Activité  ?",

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#3085d6',

      cancelButtonColor: '#d33',

      confirmButtonText: 'Oui, supprimer!'

    }).then((result) => {

      if (result.isConfirmed) {

        this.activite.etatactive = false;
        event.actif=false;
        this.service.updateActivite( this.activite.id,this.activite).subscribe(data => {
          this.toastrService.success("Suppression avec succés", "Succés", {
            duration: 5000,
              });

          this.LoadActivites();
        },

          error => {
            this.toastrService.danger("Merci de contacter le service IT", 'Erreur');
           

          });

      }

    })

  }
//supprision de Atelier 
OnDeleteAt(event: any) {
  this.atelier= event.data;
  Swal.fire({

    title: 'Attention !',

    text: "Etes vous sûr de vouloir supprimer cet Atelier  ?",

    icon: 'warning',

    showCancelButton: true,

    confirmButtonColor: '#3085d6',

    cancelButtonColor: '#d33',

    confirmButtonText: 'Oui, supprimer!'

  }).then((result) => {

    if (result.isConfirmed) {

      this.atelier.etatactive = false;
      event.actif=false;
      this.service.updateAtelier(this.atelier.id,this.atelier).subscribe(data => {
      this.toastrService.success("Suppression avec succés", "Succés", {
          duration: 5000,
            });

        this.LoadAteliers();
      },

        error => {
          this.toastrService.danger("Merci de contacter le service IT", 'Erreur');
         

        });

    }

  })

}

  
    //Dialogue edite unite 
    modifierUnite(ref: NbDialogRef<any>): void {
      this.service.updateUnite(this.unite.id,this.unite).subscribe(
        () => {
          console.log('Unite edited successfully:');
          this.LoadUnites();
          ref.close();
          this.toastrService.success('Unite modifié   avec succès', 'Succès', {
            duration: 5000,
              });
             
        },
        error => {
  
          console.error('Erreur Modification Unites: ', error);
          this.toastrService.danger('Erreur lors du modification de d\'unite', 'Erreur');
        }
      );
    }

    modifierUO(event: any): void {
      const unite = event.data;
      this.unite = { ...unite };
      this.dialogRef1 = this.dialogservice.open(this.dialogEditUnite, { context: { unite: this.unite } });
    }
   
  //Dialogue edite activite 
  modifierActivite(ref: NbDialogRef<any>): void {
    console.log(this.activite.id,this.activite)
    this.service.updateActivite(this.activite.id,this.activite).subscribe(
      () => {
        console.log('activite edited successfully:');
        this.LoadActivites();
        ref.close();
        this.toastrService.success('Activité modifié avec succès', 'Succès', {
          duration: 5000,
            });
           
      },
      error => {

        console.error('Erreur Modification activite: ', error);
        this.toastrService.danger('Erreur lors du modification d\'une activité', 'Erreur');
      }
    );
  }

  modifierAct(event: any): void {
    const activite = event.data;
    this.activite = { ...activite };
    this.dialogRef2 = this.dialogservice.open(this.dialogActivite, { context: { activite: this.activite } });
  }

   //Dialogue edite Atelier

   modifierAtelier(ref: NbDialogRef<any>): void {
    console.log(this.atelier.id,this.atelier)
    this.service.updateAtelier(this.atelier.id,this.atelier).subscribe(
      () => {
        console.log('atelier edited successfully:');
        this.LoadAteliers();
        ref.close();
        this.toastrService.success('Atelier modifié avec succès', 'Succès', {
          duration: 5000,
            });
           
      },
      error => {

        console.error('Erreur Modification atelier: ', error);
        this.toastrService.danger('Erreur lors du modification de cet atelier', 'Erreur');
      }
    );
  }

  modifierAt(event: any): void {
    const atelier = event.data;
    this.atelier = { ...atelier };
    this.dialogRef3 = this.dialogservice.open(this.dialogAtelier, { context: { atelier: this.atelier } });
  }
 

  ngOnInit(): void {

    this.service.getSite().subscribe(site=>{
      console.log("test")
      console.log(site)
      this.listeSite= site
      this.sourceSite.load(site); 
    })
    this.sourceUO=new LocalDataSource();
    this.service.getUnite().subscribe(unite=>{
     this.listeUnite=unite
      console.log(unite)
      this.sourceUO.load(unite)  ;
    })
   this.sourceActivite=new LocalDataSource(); 
    this.service.getActivite().subscribe(activite=>{
      this.listeActivite1=activite
      console.log(activite)
      this.sourceActivite.load(activite)  ;
    })
    this.sourceAtelier=new LocalDataSource();
    this.service.getAtelier().subscribe(atelier=>{
      console.log(atelier)
      this.sourceAtelier.load(atelier)  ; 
    })
  }
 
}
