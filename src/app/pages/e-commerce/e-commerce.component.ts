import { Component, ElementRef, Input, OnDestroy, OnInit, QueryList, Renderer2, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { CrudService } from '../../Service/crud.service';
import { Router } from '@angular/router';
import { NbColorHelper, NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { Habilitation } from '../../Model/Habilitation.model';
import { Procede } from '../../Model/Procede.model';
import { Utilisateur } from '../../Model/Utilisateur.model';
import { CarteControle } from '../../Model/CarteControle.model';
import { OKD } from '../../Model/OKD.model';
import { LocalDataSource } from 'ng2-smart-table';
import { MesureCC } from '../../Model/MesureCC.model';
import * as math from 'mathjs';
import { OutlineData } from '../../@core/data/visitors-analytics';
import { LayoutService } from '../../@core/utils';
import { delay, takeWhile } from 'rxjs/operators';
import { MesureOKD } from '../../Model/MesureOKD.model';
import { Critere } from '../../Model/Critere.model';
import { NbUser } from '@nebular/auth';
import { log } from 'console';

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent  implements OnInit  {
 //Declaration SettingsCarte
 SettingsCarte = {
  noDataMessage: 'Liste des cartes de Controle est vide',
  mode: "external",
  actions: {
    add:false,
    edit: true,
    delete: false,
    position: 'right',

  },
 
  edit: {

    editButtonContent: '<i class="nb-compose"></i>',
    saveButtonContent: '<i class="nb-checkmark"></i>',
    cancelButtonContent: '<i class="nb-close"></i>',

    confirmSave: true,

  }, 
  pager: {
    display: true,
    perPage: 3, // Limiter le nombre de lignes par page à 5
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
    delete: false,
    position: 'right',



  },
 
  edit: {

    editButtonContent: '<i class="nb-compose"></i>',
    saveButtonContent: '<i class="nb-checkmark"></i>',
    cancelButtonContent: '<i class="nb-close"></i>',

    confirmSave: true,

  }, 
  pager: {
    display: true,
    perPage: 3, // Limiter le nombre de lignes par page à 5
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


SettingsMesureOKD = {

  noDataMessage: 'Liste des Mesures "OK DEMARRAGE" est vide',

  mode: "external",

  actions: {
    add:false,
    edit: false,
    delete: false,
    position: 'right',



  },
 
  pager: {
    display: true,
    perPage: 3, // Limiter le nombre de lignes par page à 5
  },
 columns: {

    equipe: {

      title: 'Equipe',

      type: 'string',

    },

    evenement: {

      title: 'Evenement',

      type: 'string',

    },
    date_add: {

      title: 'Date Ajout',

      type: 'string',

    },
  }
}
  @ViewChildren('inputElement') inputElements: QueryList<ElementRef>;
  @ViewChild('PS', { static: true }) accordionPS;
  showFunctionInput: boolean = false;
  currentuser:any
  userConnecte:any
  listeHabilitaion: Habilitation[]=[]
  listeProcede:Procede[]=[]
  listeProcedefinal:Procede[]=[]
  listeUser:Utilisateur[]=[]
  habilitations:Habilitation[]=[]
  listeCarte:CarteControle[]=[]
  listeOKD:OKD[]=[]
  listemesureOKD: MesureOKD[]=[]
  imageUrl: string;
  currentProcede:Procede=new Procede()

  imageUrls: { [key: string]: string } = {};

  sourceCarte: LocalDataSource = new LocalDataSource();
  sourceOKD :LocalDataSource = new LocalDataSource();
  sourceMesureOKD :LocalDataSource = new LocalDataSource();

  carte :CarteControle=new CarteControle()
  carte1 :CarteControle=new CarteControle()
  okd :OKD=new OKD()
  min:number
  max:number
  dialogRef:NbDialogRef<any>
  dialogedit:TemplateRef<any>
  @ViewChild('dialogEdit', { static: false }) dialogEdit: TemplateRef<any>;

  
  dialogRef1:NbDialogRef<any>
  dialogeditOKD:TemplateRef<any>
  @ViewChild('dialogEditOKD', { static: false }) dialogEditOKD: TemplateRef<any>;


  numberOfInputs:number
  inputValues: number[] = [];

  newMesure:MesureCC= new MesureCC()
  newMesureOKD:MesureOKD= new MesureOKD()
  mydate=new Date()
  listeCritere:Critere[]=[]
  nbCritere:number=0
  tempVal: Record<number, string> = {};
  
  chartData1: any[] = [];
  chartDataRes: any[] = [];
// Reference lines for y=10 and y=20

data: any;
options: any;
colors: any;
chartjs: any;
  constructor( private service:CrudService,
    private route:Router,
    private dialogservice: NbDialogService,
    private toastrService: NbToastrService,
    private theme: NbThemeService,
    private layoutService: LayoutService){ 

    }
  ngOnInit(): void {
    console.log(this.mydate)
    //Extraction de user connecté 
    this.userConnecte=localStorage.getItem("user")
    this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur=>{
      this.currentuser=utilisateur
      console.log("Info header  :",this.currentuser )    
  })
  //Extraction des procedes dont l'user connecté est impliqué
  this.service.getProcede().subscribe(pros=>{
    this.listeProcede=pros
    this.listeProcede.forEach(ps => {
      this.service.getHabilitationByProcedeId(ps.id).subscribe(habilitation=>{
        this.listeHabilitaion=habilitation
        this.listeHabilitaion.forEach(hab=>{
          this.service.getUserByHabilitationId(hab.id).subscribe(user=>{
            this.listeUser=user
            if (this.listeUser.some(user => user.id === this.currentuser.id)) {
              // Si l'utilisateur connecté est trouvé, ajouter cette habilitation à la liste
              this.habilitations.push(hab); 
            }
             this.habilitations.forEach(habi=>{
             // this.listeProcedefinal.push(habi.procede) 
             if (!this.listeProcedefinal.some(proc => proc.id === habi.procede.id)) {
              this.listeProcedefinal.push(habi.procede);
            }
              
            })
            console.log("listeUser  du ps :",ps.id ," Hab ",hab.id,"==>" , this.listeUser ) 
          })  
          
        })
       
    })
     
    }) 
    console.log("ListeHabilitation " , this.habilitations ) 
    console.log("listeProcedefinal " , this.listeProcedefinal )
})
 
  }

  // fetchData1(id: number): void {
  //   // Récupérer et remplacer la série y=20 par la série de valeurs fixes
  //   this.service.getFixedValuesByCarteId(id).subscribe(fixedData => {
  //     const fixedSeries = fixedData.map(item => ({
  //       name: `${new Date(item.date).toLocaleString()} - Value ${this.min}`, 
  //       value: this.min // Utilisez la valeur min comme valeur fixe
  //     }));
  
  //     console.log('Données finales pour le graphique avec la courbe fixe :', this.chartData1); // Affiche les données finales avec la courbe fixe
  
  //     this.service.getMesureCCData(id).subscribe(data => {
  //       console.log('Données brutes :', data); // Affiche les données brutes récupérées
  
  //       if (!data) {
  //         console.log('Aucune donnée brute disponible.');
  //         return; // Arrêtez l'exécution de la fonction si les données sont nulles
  //       }
  
  //       // Créer la série principale
  //       const series1 = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(measure => ({
  //         name: `${new Date(measure.date).toLocaleString()} - Value ${measure.value}`, // Convertir la date en string lisible
  //         value: measure.value
  //       }));
  
  //       // Créer la série pour y=20
  //       const seriesY20 = this.createEmptyArray(series1.length)
  //         .map((_, index) => ({
  //           name: `${new Date(data[index].date).toLocaleString()} - Value 20`,
  //           value: 20
  //         }));
  
  //       // Ajouter la série principale et la série y=20 à chartData1
  //       this.chartData1 = [{
  //         name: 'Série de valeurs',
  //         series: series1
  //       },
  //       {
  //         name: 'min',
  //         series: fixedSeries
  //       },
  //       // {
  //       //   name: 'max y=20',
  //       //   series: seriesY20
  //       // }
  //     ];
  
  //       console.log('Données finales pour le graphique :', this.chartData1); 
  //     });
  
  //   });
  // }

  fetchDataResultat(id: number): void {
    this.service.getResultatData(id).subscribe(data => {
      console.log('Données brutes :', data); // Affiche les données brutes récupérées

      if (!data) {
        console.log('Aucune donnée brute disponible.');
        return; // Arrêtez l'exécution de la fonction si les données sont nulles
      }

      // Créer la série principale
      const series1 = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(measure => ({
        name: `${new Date(measure.date).toLocaleString()} - Value ${measure.value}`, // Convertir la date en string lisible
        value: measure.value
      }));

     
      // Ajouter la série principale et la série y=20 à chartData1
      this.chartDataRes = [{
        name: 'Série de valeurs',
        series: series1
      },
      
    ];

      console.log('Données finales pour le graphique  chartDataRes :', this.chartDataRes); 
    });
  }
  
  fetchData1(id: number): void {
    this.service.getCCById(id).subscribe(carte => {
      this.carte1 = carte;
      this.min = parseFloat(this.carte1.min.toString()); // Utilisez parseFloat pour convertir en float
      this.max = parseFloat(this.carte1.max.toString()); // Utilisez parseFloat pour convertir en float
      console.log("min/max ==>", this.min, this.max);
    });
      // Récupérer et remplacer la série y=20 par la série de valeurs fixes
      this.service.getFixedValuesByCarteId(id).subscribe(fixedData => {
        const fixedSeries = fixedData.map(item => ({
          name: `${new Date(item.date).toLocaleString()} - Value ${this.min}`, 
          value: this.min // Utilisez la valeur min comme valeur fixe
        }));
    
        // this.chartData1[1] = {
        //   name: 'Série fixe (min)',
        //   series: fixedSeries
        // };
    
        console.log('Données finales pour le graphique avec la courbe fixe :', this.chartData1); // Affiche les données finales avec la courbe fixe
    
  
    this.service.getMesureCCData(id).subscribe(data => {
      console.log('Données brutes :', data); // Affiche les données brutes récupérées
  
      // Créer la série principale
      const series1 = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(measure => ({
        name: `${new Date(measure.date).toLocaleString()} - Value ${measure.value}`, // Convertir la date en string lisible
        value: measure.value
      }));
  
      // Créer la série pour y=20
      const seriesY20 = this.createEmptyArray(series1.length)
        .map((_, index) => ({
          name: `${new Date(data[index].date).toLocaleString()} - Value 20`,
          value: 20
        }));
  
      // Ajouter la série principale et la série y=20 à chartData1
      this.chartData1 = [{
        name: 'Série de valeurs',
        series: series1
      },
      {
        name: 'min',
        series: fixedSeries
      },{
       name: 'max y=20',
       series: seriesY20
             }];
  
      console.log('Données finales pour le graphique :', this.chartData1); 
    });
  
  });
  }
  
  
  
  // fetchData1(id: number): void {
  //   this.service.getCCById(id).subscribe(carte=>{
  //     this.carte1=carte
  //     this.min=parseInt(this.carte1.min.toString())
  //     this.max=parseInt(this.carte1.max.toString())
  //     console.log("mon/max ==>",this.min, this.max)
  //   })
  //   this.service.getMesureCCData(id).subscribe(data => {
  //     console.log('Données brutes :', data); // Affiche les données brutes récupérées
  
  //     // Créer la série principale
  //     const series1 = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(measure => ({
  //       name: `${new Date(measure.date).toLocaleString()} - Value ${measure.value}`, // Convertir la date en string lisible
  //       value: measure.value
  //     }));
  
  //     // Créer la série pour y=10
  //     const seriesY10 = this.createEmptyArray(series1.length)
  //       .map((_, index) => ({
  //         name: `${new Date(data[index].date).toLocaleString()} - Value 10`,
  //         value:10
  //       }));
  //   // Créer la série pour y=20
  //   const seriesY20 = this.createEmptyArray(series1.length)
  //   .map((_, index) => ({
  //     name: `${new Date(data[index].date).toLocaleString()} - Value 10`,
  //     value:20
  //   }));
  //     // Ajouter la série y=10 à la série principale
  //     this.chartData1 = [{
  //       name: 'Série de valeurs',
  //       series: series1
  //     },
  //     {
  //       name: 'y=10',
  //       series: seriesY10
  //     },
  //     {
  //       name: 'y=20',
  //       series: seriesY20
  //     }];
  
  //     console.log('Données finales pour le graphique :', this.chartData1); // Affiche les données finales pour le graphique
  //   });
  // }

  
  
  
  

  
  
  fetchData( id: number): void {
    this.service.getMesureCCData(id).subscribe(data => {
      console.log('Données brutes :', data); // Affiche les données brutes récupérées
    
      // Transformer directement les données brutes pour le graphique
      this.chartData1 = [{
        name: 'Série de valeurs',
        series: [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(measure => ({
          name: `${new Date(measure.date).toLocaleString()} - Value ${measure.value}`, // Convertir la date en string lisible
          value: measure.value
        }))
      }];
    
      console.log('Données finales pour le graphique :', this.chartData1); // Affiche les données finales pour le graphique
    });
    // this.service.getMesureCCData(id).subscribe(data => {
    //   this.chartData1 = data.map(item => ({
    //     name: item.date,
    //     series: item.val.map((value, index) => ({
    //       name: `Value ${index + 1}`,
    //       value: value
    //     }))
    //   }));
    //   console.log("le contenue du carte de controle d'id : ",id ,this.chartData1)
    // });

    // this.service.getMesureCCData(id).subscribe(data => {
    //   console.log("Données reçues :", data);
      
    //   if (data && data.length > 0) {
    //     let allValues = [];
        
    //     data.forEach(item => {
    //       item.val.forEach((value, index) => {
    //         allValues.push({
    //           name: item.date,
    //           value: value,
    //           series: `Value ${index + 1}`
    //         });
    //       });
    //     });
        
    //     // Regroupement des valeurs par date
    //     const groupedValues = allValues.reduce((acc, cur) => {
    //       (acc[cur.name] = acc[cur.name] || []).push(cur);
    //       return acc;
    //     }, {});
        
    //     // Transformation des données regroupées pour ngx-charts
    //     this.chartData1 = Object.keys(groupedValues).map(date => ({
    //       name: date,
    //       series: groupedValues[date].map(val => ({
    //         name: val.series,
    //         value: val.value
    //       }))
    //     }));
        
    //     console.log("le contenu du carte de controle d'id : ", id, this.chartData1);
    //   } else {
    //     console.log("Aucune donnée récupérée pour l'ID : ", id);
    //   }
    // });
    
    // this.service.getMesureCCData(id).subscribe(data => {
    //   this.chartData1 = data.map(item => {
    //     if (item.measures && item.measures.length > 0 && item.measures[0].date) {
    //       return {
    //         name: new Date(item.measures[0].date), // Convertir la date en objet Date
    //         series: item.measures.map(measure => ({
    //           name: `${new Date(measure.date).toLocaleString()} - Value ${measure.value}`, // Convertir la date en string lisible
    //           value: measure.value
    //         }))
    //       };
    //     } else {
    //       return null;
    //     }
    //   }).filter(Boolean); // Filtrer les éléments nuls
    // });


    // this.service.getMesureCCData(id).subscribe(data => {
    //   console.log('Données brutes :', data); // Affiche les données brutes récupérées
    
    //   this.chartData1 = data.map(item => {
    //     if (item.measures && item.measures.length > 0 && item.measures[0].date) {
    //       const transformedData = {
    //         name: new Date(item.measures[0].date), // Convertir la date en objet Date
    //         series: item.measures.map(measure => ({
    //           name: `${new Date(measure.date).toLocaleString()} - Value ${measure.value}`, // Convertir la date en string lisible
    //           value: measure.value
    //         }))
    //       };
    //       console.log('Données transformées pour un élément :', transformedData); // Affiche les données transformées pour un élément
    //       return transformedData;
    //     } else {
    //       return null;
    //     }
    //   }).filter(Boolean); // Filtrer les éléments nuls
    
    //   console.log('Données finales pour le graphique :', this.chartData1); // Affiche les données finales pour le graphique
    // });
    // this.service.getMesureCCData(id).subscribe(data => {
    //   console.log('Données brutes :', data); // Affiche les données brutes récupérées
    
    //   this.chartData1 = data.map(item => {
    //     if (item.measures && item.measures.length > 0 && item.measures[0].date) {
    //       const transformedData = {
    //         name: new Date(item.measures[0].date), // Convertir la date en objet Date
    //         series: [...item.measures].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(measure => ({
    //           name: `${new Date(measure.date).toLocaleString()} - Value ${measure.value}`, // Convertir la date en string lisible
    //           value: measure.value
    //         }))
    //       };
    //       console.log('Données transformées pour un élément :', transformedData); // Affiche les données transformées pour un élément
    //       return transformedData;
    //     } else {
    //       return null;
    //     }
    //   }).filter(Boolean); // Filtrer les éléments nuls
    
    //   console.log('Données finales pour le graphique :', this.chartData1); // Affiche les données finales pour le graphique
    // });
    
 
 
  }
  createEmptyArray(nPoints: number) {
    return Array.from(Array(nPoints));
  }
  getDataForFirstLine(): number[] {
    return this.createEmptyArray(30)
      .map((_, index) => {
        return 2 ;
      });
  }

  toggleCC() {
    this.showFunctionInput=!this.showFunctionInput;
    this.accordionPS.toggle();
  }

  detail(dialog: TemplateRef<any>,id: number) {
    console.log("id ps ====> ",id)
   
    this.service.getCarteByProcedeId(id).subscribe(carte => {
      this.listeCarte = carte;
      this.sourceCarte = new LocalDataSource(this.listeCarte) 
      console.log("la liste des carte de controle actuel est ",carte)
    this.service.getOKDByProcedeId(id).subscribe(carte=>{
          this.listeOKD = carte;
          console.log("la liste des OKD actuel est",this.listeOKD);
          this.sourceOKD = new LocalDataSource(this.listeOKD); 
     });
      //this.dialogservice.open(dialog);
      this.dialogservice.open(dialog);
      });
    
  }
hasImageToDisplay(id:number): boolean {
    this.service.getProcedeById(id).subscribe(pro=>{
       this.currentProcede=pro
       if (this.currentProcede && this.currentProcede.files && this.currentProcede.files.length > 0) {
        for (let file of this.currentProcede.files) {
          if (this.isImageFile(file.nom.toString())) {
            return true;
          }
        }
      }
    })
   
    return false;
  }
  
  // Méthode pour vérifier si le nom du fichier se termine par une extension d'image
  isImageFile(fileName: string): boolean {
    return fileName.endsWith('.png') || fileName.endsWith('.jpg');
  }

  /*********************** Ajout De Mesure Carte Controle ********************/
 RemplirMesure(event: any): void {
    const carte = event.data;
    this.carte = { ...carte };
    this.newMesure = new MesureCC();
    this.newMesure.carte = this.carte;
  
    this.numberOfInputs = parseInt(this.carte.nb_valeur.toString(), 10); // nombre de champs de saisie
    this.inputValues = new Array(this.numberOfInputs)
   // this.fetchData1(this.carte.id);

    if(this.carte.fonction) {
      console.log("possede fonction : ",this.carte.fonction)
      this.fetchDataResultat(this.carte.id);
    
  } else {
      console.log("Ne possede pas de  fonction : ",this.carte.fonction)
      this.fetchData1(this.carte.id);
  }

    this.dialogRef = this.dialogservice.open(this.dialogEdit, { context: { carte: this.carte } });  
  }

 
  CalculeMesure(ref: NbDialogRef<any>): void {
    const expression = this.carte.fonction;
    console.log(expression)
    const values = {};
    console.log("les valeurs entrées sont : ",this.newMesure.val)
    const filteredValues = this.newMesure.val.filter(value => value !== null && value !== undefined);

    // Vérification des valeurs saisies
    if (
      filteredValues.length === 0 || filteredValues.length < this.carte.nb_valeur) {
          this.toastrService.danger('Veuillez SVP remplir tous les mesures avec des valeurs valides!!', 'Erreur');
          return;
    }

    this.newMesure.val.forEach((value, index) => {
      values['V' + (index + 1)] = value;
    });
    const result = this.evaluateExpression(expression, values);
    this.newMesure.resultat = result;
    console.log("resultat calcule : ",result);
    console.log('Fréquence:', this.newMesure.motif_saisie);
    console.log('newMesure:', this.newMesure);
  }

SaveMesure(ref: NbDialogRef<any>): void {
  

if(this.carte.fonction){
  if (!this.newMesure.resultat || !this.newMesure.motif_saisie) {
    this.toastrService.danger('Veuillez remplir tous les champs!!', 'Erreur');
    return;
  }
}else{
  const filteredValues = this.newMesure.val.filter(value => value !== null && value !== undefined);

  if (filteredValues.length === 0 || filteredValues.length < this.carte.nb_valeur) {
        this.toastrService.danger('Veuillez SVP remplir tous les mesures avec des valeurs valides!!', 'Erreur');
        return;
  }else if ( !this.newMesure.motif_saisie) {
    this.toastrService.danger('Veuillez remplir tous les champs!!', 'Erreur');
    return;
  }
}
  this.newMesure.carte = this.carte;
  this.newMesure.operateur = this.currentuser.id;
  const currentDate = new Date();
  const localDate = new Date(currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000) + (60 * 60000)); // Ajoute une heure en millisecondes
  const formattedDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')} ${String(localDate.getHours()).padStart(2, '0')}:${String(localDate.getMinutes()).padStart(2, '0')}`;
  this.newMesure.date =formattedDate

  console.log("les valeurs sont : ",this.newMesure.val)
  this.service.addMesureCC(this.newMesure).subscribe(
    (mesureSaved) => {
      console.log('Mesure added successfully:', mesureSaved);
      this.resetValues();
   
    },
      
    
    (error) => {
      console.error('Error adding MesureCC:', error);
      this.toastrService.danger('Erreur lors de l\'ajout du nouvelle Mesure', 'Erreur');
    }
  );
}
  //evaluer fonction :
  evaluateExpression(expression: string, values: Record<string, number>): number {
    const scope = values;
    return math.evaluate(expression, scope);
}

resetValues(): void {
  this.newMesure = new MesureCC();
  this.inputValues = new Array(this.numberOfInputs);
}

  /*********************** Ajout De Mesure Ok Demmarage  ********************/
  RemplirMesureOKD(event: any): void {
    const okd = event.data;
    this.okd = { ...okd };
    this.service.getCritereByOkdId(this.okd.id).subscribe(liste=>{
      this.listeCritere=liste
      this.nbCritere=this.listeCritere.length
    })
    console.log("cette okd",this.okd.id,"possede nbcritere : ", this.nbCritere ,"qui sont => : ",this.listeCritere)
    this.newMesureOKD = new MesureOKD();
    this.newMesureOKD.okd = this.okd;
    this.LoadMesureByOKD(this.okd.id);
    this.dialogRef1 = this.dialogservice.open(this.dialogEditOKD, { context: { okd: this.okd } });  
  }



  selectedValues: (string | null)[] = new Array(this.listeCritere.length).fill(null);
  enteredValues: (number | null)[] = new Array(this.listeCritere.length).fill(null);

  
updateTempVal(index: number, critereId: number): void {
  const selectedValue = this.selectedValues[index];
  if (selectedValue !== null) {
    this.tempVal[critereId.toString()] = selectedValue;
  }
}

updateTempVal1(index: number, critereId: number): void {
  const enteredValue = this.enteredValues[index];
  if (enteredValue !== null) {
   const numericValue = enteredValue.toString();
   this.tempVal[critereId.toString()] = numericValue;
  }
}

  
  saveMesureOKD(): void {
    this.newMesureOKD.operateur = this.currentuser.id;
    const currentDate = new Date();
    const localDate = new Date(currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000) + (60 * 60000)); // Ajoute une heure en millisecondes
    const formattedDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')} ${String(localDate.getHours()).padStart(2, '0')}:${String(localDate.getMinutes()).padStart(2, '0')}`;
    this.newMesureOKD.date_add =formattedDate
  
    // Assigner tempVal à newMesureOKD.val
    this.newMesureOKD.val = this.tempVal;
  
    console.log('Valeurs du formulaire : ', this.newMesureOKD.val);
    console.log('La mesure du okd : ', this.newMesureOKD);
  
    this.service.addMesureOKD(this.newMesureOKD).subscribe(response => {
      console.log("Mesure finale  :  ", this.newMesureOKD);
      this.toastrService.success('Ajout est effectué avec succé ', 'Success');
      this.LoadMesureByOKD(this.okd.id);
    });
  
    // Réinitialiser les valeurs
    // this.selectedValues = new Array(this.listeCritere.length).fill(null);
    // this.enteredValues = new Array(this.listeCritere.length).fill(null);
    // this.tempVal = {};
  }
  

  
  LoadMesureByOKD(id:number){
    this.service.getMesureOKDByOKDId(id).subscribe(mesure=>{
    this.listemesureOKD=mesure.reverse();
    console.log(this.listemesureOKD)
    this.sourceMesureOKD = new LocalDataSource(this.listemesureOKD) 
    })
    }
    
   
}
