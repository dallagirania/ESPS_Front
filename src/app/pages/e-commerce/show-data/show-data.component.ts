import { Component, ElementRef, Input, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { NbColorHelper, NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { CrudService } from '../../../Service/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { CarteControle } from '../../../Model/CarteControle.model';
import { Habilitation } from '../../../Model/Habilitation.model';
import { Procede } from '../../../Model/Procede.model';
import { Utilisateur } from '../../../Model/Utilisateur.model';
import { OKD } from '../../../Model/OKD.model';
import { MesureOKD } from '../../../Model/MesureOKD.model';
import { LocalDataSource } from 'ng2-smart-table';
import { MesureCC } from '../../../Model/MesureCC.model';
import { Critere } from '../../../Model/Critere.model';
import { LayoutService } from '../../../@core/utils';
import * as math from 'mathjs';
import * as XLSX from 'xlsx';
import { forkJoin, of,Observable } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { OperateurRenderComponent } from '../../Controle/operateur-render/operateur-render.component';
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ConformiteStyleComponent } from '../../Controle/conformite-style/conformite-style.component';
import { Notifications } from '../../../Model/Notification.model';
Chart.register(zoomPlugin);
@Component({
  selector: 'ngx-show-data',
  templateUrl: './show-data.component.html',
  styleUrls: ['./show-data.component.scss']
})
export class ShowDataComponent implements   OnInit,OnDestroy {
  @Input() id: number;
  carte1 :CarteControle=new CarteControle()
  min:number
  max:number
  maximal:number
  chartDataRes:any
  chartData1:any
  data: any;
  options: any;
  colors: any;
  chartjs: any;
  message:string;
  subject:string;
  private themeSubscription: Subscription;

  utilisateur=new Utilisateur()
  notify=new Notifications()
  user:Utilisateur[]=[]

   //Declaration SettingsCarte
 SettingsCarte = {
  noDataMessage: 'Liste des cartes de Controle est vide',
  mode: "external",
  actions: {
    add:false,
    edit: true,
    delete: false,
  //  position: 'right',

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

  noDataMessage: 'Liste des Check-listes "OK DEMARRAGE " est vide',

  mode: "external",

  actions: {
    add:false,
    edit: true,
    delete: false,
  //  position: 'right',



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

  //Declaration SettingsMesure
  SettingsMesure = {
    noDataMessage: 'Liste des Mesures Cartes de Controlles est vide',
    mode: "external",
    actions: {
      add:false,
      edit: false,
      delete: false,
    //  position: 'right',
  
    },
   
    pager: {
      display: true,
      perPage: 3, // Limiter le nombre de lignes par page à 5
    },
    columns: {
     date: {
       title: 'Date',
       type: 'string',
     },
     etatactive: {
      title: 'Conformité',
      type: 'custom',
      valuePrepareFunction: (cell, row) => row.etatactive, // Utilisez row.id au lieu de cell.id
      renderComponent: ConformiteStyleComponent
      // valuePrepareFunction: (cell, row) => {
      //     console.log("Valeur de etatvalide :", row.etatactive);
      //     if (row.etatactive === false) {
      //         return "<p class='text-danger'style='background-color: #f8d7da; padding: 5px;'>Non Conforme</p>";
      //     } else {
      //         return "<p class='text-success'>Conforme</p>";
      //     }
      // },
  },
    etatvalide: {
      title: 'Validation',
      type: 'html',
      valuePrepareFunction: (cell, row) => {
        //  console.log("Valeur de etatvalide :", row.etatvalide);
          if (row.etatvalide === false) {
            return '<i class="fas fa-times-circle fa-2x text-danger" ></i>';
        } else {
            return '<i class="fas fa-check fa-2x text-success"></i>';
        }
      },
  },
     val: {
       title: 'Valeurs',
       type: 'array',
     },
     resultat: {
       title: 'Résultat',
       type: 'string',
     },
     min: {
      title: 'MIN ',
      type: 'string',
    },
    max: {
      title: 'Max',
      type: 'string',
    },
     operateurMatricule: {

      title: 'Matricule Opérateur',
      type: 'string',
    },
  
 
  
    qualiticienMatricule: {

      title: 'Matricule Qualiticien',
      type: 'string',
    },
   },
  }

SettingsMesureOKD = {

  noDataMessage: 'Liste des Mesures "OK DEMARRAGE" est vide',

  mode: "external",

  actions: {
    add:false,
    edit: false,
    delete: false,
  //  position: 'right',



  },
 
  pager: {
    display: true,
    perPage: 3, // Limiter le nombre de lignes par page à 5
  },
 columns: {
  id: {
    title: 'Les Mesures',
    type: 'custom',
    filter:false,
    renderComponent: OperateurRenderComponent
  },
   date_add: {
    title: 'Date Ajout',
    type: 'string',
  },
 
  etatactive: {
    title: 'Conformité',
    type: 'custom',
    valuePrepareFunction: (cell, row) => row.etatactive, // Utilisez row.id au lieu de cell.id
    renderComponent: ConformiteStyleComponent
   
},

  etatvalide: {
    title: 'Validation',
    type: 'html',
    valuePrepareFunction: (cell, row) => {
    //    console.log("Valeur de etatvalide :", row.etatvalide);
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
  
 
  
    qualiticienMatricule: {

      title: 'Matricule Qualiticien',
      type: 'string',
    },
 
   
  }
}
  @ViewChildren('inputElement') inputElements: QueryList<ElementRef>;
  @ViewChild('PS', { static: true }) accordionPS;
  showFunctionInput: boolean = false;
  showDetails: boolean = false;
  showDetailsOKD: boolean = false;
  buttonload:boolean = false;
  buttonloadOKD:boolean = false;
  loadingMediumGroup = false;
  NonConformite:boolean=false;
  ConformAjout: boolean = true;
  ConformAjoutOKD: boolean = true;

  Activespinner: boolean = false;
  bouttonactive: boolean ;
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
  listeMesure:MesureCC[]=[]
  lastItems=new MesureCC
  imageUrl: string;
  currentProcede:Procede=new Procede()
  
  imageUrls: { [key: string]: string } = {};

  sourceCarte: LocalDataSource = new LocalDataSource();
  sourceOKD :LocalDataSource = new LocalDataSource();
  sourceMesureOKD :LocalDataSource = new LocalDataSource();
  sourceMesure: LocalDataSource = new LocalDataSource();
  carte :CarteControle=new CarteControle()
  
  okd :OKD=new OKD()
  
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
   constructor(
     private router: Router,
     private fb: FormBuilder,
     private rout:ActivatedRoute,
     private service:CrudService,
     private route:Router,
     private dialogservice: NbDialogService,
     private toastrService: NbToastrService,
     private theme: NbThemeService,
     private layoutService: LayoutService,)
      { 

     }
  ngOnInit(): void {
   // console.log(this.mydate)
    //Extraction de user connecté 
    this.userConnecte=localStorage.getItem("user")
    this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur=>{
      this.currentuser=utilisateur
   //   console.log("Info header  :",this.currentuser )    
  })
  //Extraction des procedes dont l'user connecté est impliqué
  this.service.getProcede().subscribe(pros=>{
    this.listeProcede=pros
    this.listeProcede.forEach(ps => {
      this.service.getHabilitationByProcedeId(ps.id).subscribe(habilitation=>{
        this.listeHabilitaion=habilitation
        this.listeHabilitaion.forEach(hab=>{
          this.service.getAllUserByHabilitationIdandDate(hab.id).subscribe(user=>{
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
      //      console.log("listeUser  du ps :",ps.id ," Hab ",hab.id,"==>" , this.listeUser ) 
          })  
          
        })
       
    })
     
    }) 
  //  console.log("ListeHabilitation " , this.habilitations ) 
   // console.log("listeProcedefinal " , this.listeProcedefinal )
})
    // console.log("id envoye par pere : ",this.id)
    // this.service.getCCById(this.id).subscribe(carte=>{
    //   this.carte1=carte
    //   console.log("la courbe correspond à cette carte de controle : ",this.carte1)

    //   if(this.carte1.fonction) {
    //     console.log("possede fonction : ",this.carte1.fonction)
    //     this.fetchDataResultat(this.carte1.id);
      
    // } else {
    //     console.log("Ne possede pas de  fonction : ",this.carte1.fonction)
    //      this.fetchData1(this.carte1.id);
    // }
  
    // })
  
  }

fetchDataResultat(id: number): void {
  this.service.getCCById(id).subscribe(carte => {
    this.carte1 = carte;
    this.min = parseFloat(this.carte1.min.toString());
    this.max = parseFloat(this.carte1.max.toString());
  //  console.log("min/max ==>", this.min, this.max);

    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.colors = config.variables;
      this.chartjs = config.variables.chartjs;

      this.service.getResultatData(id).subscribe(data => {
    //    console.log('Données brutes :', data);

        if (!data) {
       //   console.log("data nul !!! ")
          const yMinData = new Array(2).fill(this.min);
          const yMaxData = new Array(2).fill(this.max);
          this.chartDataRes = {
            labels: ['Label 1', 'Label 2'], // Labels statiques
            datasets: [
               {
              data: yMinData,
              label: 'y=min',
              backgroundColor: 'rgba(252, 181, 178 , 0.3)',
              borderColor: 'rgba(176, 243, 120, 1)',
            }, {
              data: yMaxData,
              label: 'y=max',
              backgroundColor: 'rgba(135, 231, 53, 0.3)',
              borderColor: 'rgba(176, 243, 120, 1)',
            }],
          };
          return; // Sortie anticipée
        }
        if (data.length ==1 ) {
       //   console.log("data  ==1  !!! ")
        //  console.log("this.min",this.min,"this.max",this.max)
          const yMinData = new Array(2).fill(this.min);
          const yMaxData = new Array(2).fill(this.max);
          const series1 = data.map(measure => measure.value);
          const currentDate = new Date().toLocaleString(); 
      //    console.log("series1",series1)
      //    console.log("labels",[currentDate].concat(data.map(measure => new Date(measure.date).toLocaleString())), )
          this.chartDataRes = {
            labels: [currentDate].concat(data.map(measure => new Date(measure.date).toLocaleString())), 
            datasets: [
              {data: series1,
              label: 'Courbe de controle',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              borderColor: this.colors.primary,
            }, {
              data: yMinData,
              label: 'y=min',
              backgroundColor: 'rgba(252, 181, 178 , 0.3)',
              borderColor: 'rgba(176, 243, 120, 1)',
            }, {
              data: yMaxData,
              label: 'y=max',
              backgroundColor: 'rgba(135, 231, 53, 0.3)',
              borderColor: 'rgba(176, 243, 120, 1)',
            }],
          };
          return; // Sortie anticipée
        }

        const series1Data = data.map(measure => measure.value);
        this.maximal = Math.max(...series1Data);
    //    console.log("la valeur max du courbe est : ",this.maximal)
        const yMinData = new Array(data.length).fill(this.min);
        const yMaxData = new Array(data.length).fill(this.max);
        if(this.maximal>this.max){
          const yFinData = new Array(data.length).fill(this.maximal + 20);
          this.chartDataRes = {
            labels: data.map(measure => new Date(measure.date).toLocaleString()),
            datasets: [{
              data: series1Data,
              label: 'Courbe de controle',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              borderColor: this.colors.primary,
            }, {
              data: yMinData,
              label: 'y=min',
              backgroundColor: 'rgba(252, 181, 178 , 0.3)',
              borderColor: 'rgba(176, 243, 120, 1)',
            }, {
              data: yMaxData,
              label: 'y=max',
              backgroundColor: 'rgba(135, 231, 53, 0.3)',
              borderColor: 'rgba(176, 243, 120, 1)',
            }, {
              data: yFinData,
              label: 'Cadre',
              backgroundColor: 'rgba(252, 181, 178, 0.3)',
            }],
          };
  
          
        }else{
          const yFinData = new Array(data.length).fill(this.max + 20);
          this.chartDataRes = {
            labels: data.map(measure => new Date(measure.date).toLocaleString()),
            datasets: [{
              data: series1Data,
              label: 'Courbe de controle',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              borderColor: this.colors.primary,
            }, {
              data: yMinData,
              label: 'y=min',
              backgroundColor: 'rgba(252, 181, 178 , 0.3)',
              borderColor: 'rgba(176, 243, 120, 1)',
            }, {
              data: yMaxData,
              label: 'y=max',
              backgroundColor: 'rgba(135, 231, 53, 0.3)',
              borderColor: 'rgba(176, 243, 120, 1)',
            }, {
              data: yFinData,
              label: 'Cadre',
              backgroundColor: 'rgba(252, 181, 178, 0.3)',
            }],
          };
  
        }
        this.options = {
          
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              gridLines: {
                display: true,
                color: this.chartjs.axisLineColor,
              },
              ticks: {
                fontColor: this.chartjs.textColor,
              },
            }],
            yAxes: [{
              gridLines: {
                display: true,
                color: this.chartjs.axisLineColor,
              },
              ticks: {
                fontColor: this.chartjs.textColor,
              },
            }],
          },
          legend: {
            labels: {
              fontColor: this.chartjs.textColor,
            },
          },
          plugins: {
            zoom: {
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true
                },
                mode: 'xy',
              },
              pan: {
                enabled: true,
                mode: 'xy',
              },
            }
          }
        };

     //   console.log('Données finales pour le graphique chartDataRes :', this.chartDataRes);
      });
    });
  });
}

fetchData1(id: number): void {
  this.service.getCCById(id).subscribe(carte => {
    this.carte1 = carte;
    this.min = parseFloat(this.carte1.min.toString());
    this.max = parseFloat(this.carte1.max.toString());
  //  console.log("min/max ==>", this.min, this.max);

    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.colors = config.variables;
      this.chartjs = config.variables.chartjs;

      this.service.getMesureCCData(id).subscribe(data => {
      //  console.log('Données brutes :', data);

        if (!data) {
       //   console.log("data nul ou <2 !!! ")
          const yMinData = new Array(2).fill(this.min);
          const yMaxData = new Array(2).fill(this.max);
          this.chartData1 = {
            labels: ['Label 1', 'Label 2'], // Labels statiques
            datasets: [
               {
              data: yMinData,
              label: 'y=min',
              backgroundColor: 'rgba(252, 181, 178 , 0.3)',
              borderColor: 'rgba(176, 243, 120, 1)',
            }, {
              data: yMaxData,
              label: 'y=max',
              backgroundColor: 'rgba(135, 231, 53, 0.3)',
              borderColor: 'rgba(176, 243, 120, 1)',
            }],
          };
          return; // Sortie anticipée
        }
        if (data.length < 2) {
      //    console.log("data nul ou <2 !!! ")
          const yMinData = new Array(2).fill(this.min);
          const yMaxData = new Array(2).fill(this.max);
          const series1 = data.map(measure => measure.value);
          this.chartData1 = {
            labels: data.map(measure => new Date(measure.date).toLocaleString()),
            datasets: [
              {data: series1,
              label: 'Courbe de controle',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              borderColor: this.colors.primary,
            }, {
              data: yMinData,
              label: 'y=min',
              backgroundColor: 'rgba(252, 181, 178 , 0.3)',
              borderColor: 'rgba(176, 243, 120, 1)',
            }, {
              data: yMaxData,
              label: 'y=max',
              backgroundColor: 'rgba(135, 231, 53, 0.3)',
              borderColor: 'rgba(176, 243, 120, 1)',
            }],
          };
          return; // Sortie anticipée
        }

        const series1 = data.map(measure => measure.value);
        this.maximal = Math.max(...series1);
      //  console.log("la valeur max du courbe est : ",this.maximal)
        const yMinData = new Array(data.length).fill(this.min);
        const yMaxData = new Array(data.length).fill(this.max);

        if(this.maximal>this.max){
          const yFinData = new Array(data.length).fill(this.maximal + 20);
          this.chartData1 = {
            labels: data.map(measure => new Date(measure.date).toLocaleString()),
            datasets: [{
              data: series1,
              label: 'Courbe de controle',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              borderColor: this.colors.primary,
            }, {
              data: yMinData,
              label: 'y=min',
              backgroundColor: 'rgba(252, 181, 178 , 0.3)',
              borderColor: 'rgba(176, 243, 120, 1)',
            }, {
              data: yMaxData,
              label: 'y=max',
              backgroundColor: 'rgba(135, 231, 53, 0.3)',
              borderColor: 'rgba(176, 243, 120, 1)',
            }, {
              data: yFinData,
              label: 'Cadre',
              backgroundColor: 'rgba(252, 181, 178, 0.3)',
            }],
          };
  
          
        }else{
          const yFinData = new Array(data.length).fill(this.max + 20);
          this.chartData1 = {
            labels: data.map(measure => new Date(measure.date).toLocaleString()),
            datasets: [{
              data: series1,
              label: 'Courbe de controle',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              borderColor: this.colors.primary,
            }, {
              data: yMinData,
              label: 'y=min',
              backgroundColor: 'rgba(252, 181, 178 , 0.3)',
              borderColor: 'rgba(176, 243, 120, 1)',
            }, {
              data: yMaxData,
              label: 'y=max',
              backgroundColor: 'rgba(135, 231, 53, 0.3)',
              borderColor: 'rgba(176, 243, 120, 1)',
            }, {
              data: yFinData,
              label: 'Cadre',
              backgroundColor: 'rgba(252, 181, 178, 0.3)',
            }],
          };
  
        }
        
        // this.chartData1 = {
        //   labels: data.map(measure => new Date(measure.date).toLocaleString()),
        //   datasets: [{
        //     data: series1,
        //     label: 'Courbe de controle',
        //     backgroundColor: 'rgba(0, 0, 0, 0)',
        //     borderColor: this.colors.primary,
        //   }, {
        //     data: yMinData,
        //     label: 'y=min',
        //     backgroundColor: 'rgba(252, 181, 178 , 0.3)',
        //     borderColor: 'rgba(176, 243, 120, 1)',
        //   }, {
        //     data: yMaxData,
        //     label: 'y=max',
        //     backgroundColor: 'rgba(135, 231, 53, 0.3)',
        //     borderColor: 'rgba(176, 243, 120, 1)',
        //   }, {
        //     data: yFinData,
        //     label: 'Cadre',
        //     backgroundColor: 'rgba(252, 181, 178, 0.3)',
        //   }],
        // };
         // Ajout des options de zoom
      // this.options.plugins = {
      //   zoom: {
      //     zoom: {
      //       enabled: true,
      //       mode: 'xy',
      //     },
      //   },
      // };

        this.options = {
         
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              gridLines: {
                display: true,
                color: this.chartjs.axisLineColor,
              },
              ticks: {
                fontColor: this.chartjs.textColor,
              },
            }],
            yAxes: [{
              gridLines: {
                display: true,
                color: this.chartjs.axisLineColor,
              },
              ticks: {
                fontColor: this.chartjs.textColor,
              },
            }],
          },
          legend: {
            labels: {
              fontColor: this.chartjs.textColor,
            },
          },
          plugins: {
            zoom: {
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true
                },
                mode: 'xy',
              },
              pan: {
                enabled: true,
                mode: 'xy',
              },
            }
          }
        };
      //  console.log('Données finales pour le graphique :', this.chartData1);
      });
    });
  });
}


  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
  PlusDetails(){
    this.showDetails=!this.showDetails;
  }
  PlusDetailsIKD(){
    this.showDetailsOKD=!this.showDetailsOKD;
  }
  toggleCC() {
    this.showFunctionInput=!this.showFunctionInput;
  }

  detail(dialog: TemplateRef<any>,id: number) {   
    this.service.getCarteByProcedeId(id).subscribe(carte => {
      this.listeCarte = carte;
      this.sourceCarte = new LocalDataSource(this.listeCarte) 
      this.service.getOKDByProcedeId(id).subscribe(carte=>{
          this.listeOKD = carte;
       //   console.log("la liste des OKD actuel est",this.listeOKD);
          this.sourceOKD = new LocalDataSource(this.listeOKD); 
     });
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
 // console.log("carte actuelle : ",this.carte)
  this.newMesure = new MesureCC();
  this.newMesure.carte = this.carte;

  this.numberOfInputs = parseInt(this.carte.nb_valeur.toString(), 10); // nombre de champs de saisie
  this.inputValues = new Array(this.numberOfInputs)
 // this.fetchData1(this.carte.id);
 this.LoadMesureByCC(this.carte.id)
 this.verifierConformiteSansMail(this.carte.id)
  if(this.carte.fonction) {
 //   console.log("possede fonction : ",this.carte.fonction)
    this.fetchDataResultat(this.carte.id);
  
} else {
  //  console.log("Ne possede pas de  fonction : ",this.carte.fonction)
    this.fetchData1(this.carte.id);
}

  this.dialogRef = this.dialogservice.open(this.dialogEdit, { context: { carte: this.carte } });  
}

verifierConformite(id: number): void {
  this.service.getMesureCCByCarteId(id).subscribe(mesure => {
    this.listeMesure = mesure.reverse();
 //   console.log("Mesure cc : ", mesure);
    
    // Vérifier si les deux dernières lignes ont un etatactive false
    if (this.listeMesure.length >= 2) {
      const lastTwoItems = this.listeMesure.slice(0, 2); // Les deux dernières lignes
      const bothFalse = lastTwoItems.every(item => item.etatactive === false);
       this.lastItems = this.listeMesure.slice(1)[0];
      const NonValide = lastTwoItems.every(item => item.etatvalide === false);
      const Valide = lastTwoItems.every(item => item.etatvalide === true);
      if (bothFalse && NonValide) {
    //    console.log("Les deux dernières lignes ont un etatactive false");
        this.toastrService.warning(`SVP Contacter le servoice Qualité , Vous etes en cas de Non Conformité `, 'Warning');
        this.ConformAjout=false
        this.service.mailblockC(this.lastItems).subscribe(mail=>{
        })
      }else if(bothFalse && Valide){
        this.ConformAjout=true
      }
    }
  });
}
verifierConformiteSansMail(id: number): void {
  this.service.getMesureCCByCarteId(id).subscribe(mesure => {
    this.listeMesure = mesure.reverse();
    if (this.listeMesure.length >= 2) {
      const lastTwoItems = this.listeMesure.slice(0, 2); // Les deux dernières lignes
      const bothFalse = lastTwoItems.every(item => item.etatactive === false);
       this.lastItems = this.listeMesure.slice(1)[0];
      const NonValide = lastTwoItems.every(item => item.etatvalide === false);
      const Valide = lastTwoItems.every(item => item.etatvalide === true);
      if (bothFalse && NonValide) {
        console.log("Les deux dernières lignes ont un etatactive false");
        this.toastrService.warning(`SVP Contacter le servoice Qualité , Vous etes en cas de Non Conformité `, 'Warning');
        this.ConformAjout=false
      }else if(bothFalse && Valide){
        this.ConformAjout=true
      }
    }
  });
}

CalculeMesure(ref: NbDialogRef<any>): void {
  const expression = this.carte.fonction;
  //console.log(expression)
  const values = {};
 // console.log("les valeurs entrées sont : ",this.newMesure.val)
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
 // console.log("resultat calcule : ",result);
//  console.log('Fréquence:', this.newMesure.motif_saisie);
//  console.log('newMesure:', this.newMesure);
}

SaveMesure(ref: NbDialogRef<any>): void {
    this.buttonload = true;
    this.loadingMediumGroup = true;
    this.NonConformite=true
    this.Activespinner=true
    
    const min=parseInt(this.carte.min.toString())
    const max=parseInt(this.carte.max.toString())

    if(this.carte.fonction){
        if (!this.newMesure.resultat || !this.newMesure.motif_saisie) {
          this.toastrService.danger('Veuillez remplir tous les champs!!', 'Erreur');
          this.buttonload = false;
          this.loadingMediumGroup = false;
          this.NonConformite=false
          this.Activespinner=false
          return;
        }
        if (this.newMesure.resultat < min || this.newMesure.resultat > max) {
          this.newMesure.etatactive = false
        }
    }else{

    const filteredValues = this.newMesure.val.filter(value => value !== null && value !== undefined);

    if (filteredValues.length === 0 || filteredValues.length < this.carte.nb_valeur) {
          this.toastrService.danger('Veuillez SVP remplir tous les mesures avec des valeurs valides!!', 'Erreur');
          this.buttonload = false;
          this.loadingMediumGroup = false;
          this.NonConformite=false
          this.Activespinner=false
          return;
    }else if ( !this.newMesure.motif_saisie) {
      this.toastrService.danger('Veuillez remplir tous les champs!!', 'Erreur');
      this.buttonload = false;
      this.loadingMediumGroup = false;
      this.NonConformite=false
      this.Activespinner=false
      return;
    }
    // Vérification des valeurs enregistrées parmi les valeurs minimales et maximales de la carte
  for (let i = 0; i < this.newMesure.val.length; i++) {
    const value = this.newMesure.val[i];
    if (value < min || value > max) {
      this.newMesure.etatactive = false
    }
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
     //    this.service.mailNonConformite(this.newMesure)
        console.log('Mesure added successfully:', mesureSaved);
        this.buttonload = false;
        this.loadingMediumGroup = false;
        this.NonConformite=false
        this.Activespinner=false

        if(this.newMesure.etatactive == false)
          { 
          Swal.fire({
              title: 'Erreur!',
              text: 'Vous avez un probléme de Nom Conformité pour cette Carte De Controle !!! Refaire les Mesure SVP  .',
              icon: 'warning',
              confirmButtonColor: '#0CA417',
              confirmButtonText: 'OK'
            });
          }
          else {
            Swal.fire({
              title: 'Success!',
              text: 'Mesure Ajouté avec succée , vous etes en cas de conformité .',
              icon: 'warning',
              confirmButtonColor: '#0CA417',
              confirmButtonText: 'OK'
            });

          }
      
        this.resetValues();
        this.LoadMesureByCC(this.carte.id)
        this.verifierConformite(this.carte.id)
        if(this.carte.fonction) {
          console.log("possede fonction : ",this.carte.fonction)
          this.fetchDataResultat(this.carte.id);

        
      } else {
          console.log("Ne possede pas de  fonction : ",this.carte.fonction)
          
          this.fetchData1(this.carte.id);
      }
      
    
      },
        
      
      (error) => {
        console.error('Error adding MesureCC:', error);
        this.buttonload = false;
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
  //Boutton ajout n'est plus accéssible 
  this.verifierConformiteOKD(this.okd.id).subscribe((isConforme) => {
    this.bouttonactive=isConforme
    if (isConforme) {
      console.log("L'OKD est conforme.");
    } else {
      console.log("L'OKD n'est pas conforme.");
      this.toastrService.warning(`SVP Contacter le servoice Qualité , Vous etes en cas de Non Conformité `, 'Warning');
      
    }
  });
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
  this.buttonloadOKD=true
  this.loadingMediumGroup = true;
  this.NonConformite=true
  this.Activespinner=true

  const nb_valeurs= Object.keys(this.tempVal).length;
  console.log("nb valeur remplis sont ",nb_valeurs)
  this.service.getCritereByOkdId(this.okd.id).subscribe(liste=>{
    this.listeCritere=liste
    this.nbCritere=this.listeCritere.length
  })
    if( !this.newMesureOKD.equipe||!this.newMesureOKD.evenement){
    this.toastrService.danger('Veuillez SVP remplir tous les champs vides svp!!', 'Erreur');
    this.loadingMediumGroup = false;
    this.NonConformite=false
    this.buttonloadOKD=false
    this.Activespinner=false
    return;
  }else if(this.nbCritere>nb_valeurs)
    {
    this.toastrService.danger('Veuillez SVP remplir tous les mesures avec des valeurs valides!!', 'Erreur');
    this.loadingMediumGroup = false;
    this.NonConformite=false
    this.buttonloadOKD=false
    this.Activespinner=false
    return;
    }

  this.newMesureOKD.operateur = this.currentuser.id;
  const currentDate = new Date();
  const localDate = new Date(currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000) + (60 * 60000)); // Ajoute une heure en millisecondes
  const formattedDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')} ${String(localDate.getHours()).padStart(2, '0')}:${String(localDate.getMinutes()).padStart(2, '0')}`;
  this.newMesureOKD.date_add =formattedDate
  // Assigner tempVal à newMesureOKD.val
  this.newMesureOKD.val = this.tempVal;

  console.log('Valeurs du formulaire : ', this.newMesureOKD.val);
  console.log('La mesure du okd : ', this.newMesureOKD);
  this.validateMesureOKD().subscribe(({isValid, invalidValues}) => {
    this.newMesureOKD.etatactive=isValid
    this.service.addMesureOKD(this.newMesureOKD).subscribe(response => {
      console.log("Mesure finale  :  ", this.newMesureOKD);
    //  this.service.mailNonConformiteOKD(this.newMesureOKD)
      this.buttonloadOKD=false
      this.loadingMediumGroup = false;
      this.NonConformite=false
      this.Activespinner=false
       //Boutton ajout n'est plus accéssible 
      this.verifierConformiteOKD(this.okd.id).subscribe((isConforme) => {
        this.bouttonactive=isConforme
        if (isConforme) {
          console.log("L'OKD est conforme.");

        } else {
          console.log("L'OKD n'est pas conforme.");
          this.service.mailblockOKD(this.newMesureOKD).subscribe(mail=>{
            console.log("mail envoyé avec succés !!!")
          })
          this.toastrService.warning(`SVP Contacter le servoice Qualité , Vous etes en cas de Non Conformité `, 'Warning');
      
        }
      });

      if (this.newMesureOKD.etatactive==true) {
        console.log('Toutes les valeurs des critères sont valides.', this.newMesureOKD.etatactive);
        Swal.fire({
          title: 'Success!',
          text: 'Mesure Ajouté avec succée , vous etes en cas de conformité .',
          icon: 'success',
          confirmButtonColor: '#0CA417',
          confirmButtonText: 'OK'
        });
      } else {
        console.log('Au moins une valeur de critère est invalide.', this.newMesureOKD.etatactive);
        Swal.fire({
          title: 'Erreur!',
          html: `
            <p style="font-weight: bold;"">Vous avez un problème de non-conformité pour cette Check-list "OK DEMARRAGE" !!!</p>
            <p style="font-weight: bold;"">Les mesures à prendre pour rattraper la Non Conformité sont :</p>
            <ul>
              ${invalidValues
                .split('<br>')
                .filter(value => value.trim() !== '') 
                .map(value => `<li style="font-weight: bold;color:#660805" >${value.trim()}</li>`)
                .join('')}
            </ul>
          `,
          icon: 'warning',
          confirmButtonColor: '#D31F18',
          confirmButtonText: 'OK'
        });
        
        
        
      }
   
        this.LoadMesureByOKD(this.okd.id);
        this.tempVal = {};
        this.newMesureOKD.equipe=null
        this.newMesureOKD.evenement=null
      });
   
  
  });
 
  // Réinitialiser les valeurs

  this.selectedValues = new Array(this.listeCritere.length).fill(null);
  this.enteredValues = new Array(this.listeCritere.length).fill(null);
  
}


// validateMesureOKD(): Observable<boolean> {
//   return new Observable<boolean>((observer) => {
//     let isValid = true; // Initialiser la variable isValid à true au début de la validation

//     this.service.getCritereByOkdId(this.okd.id).subscribe(liste=>{
//       this.listeCritere=liste
//       this.nbCritere=this.listeCritere.length

//       for (let i = 0; i < this.listeCritere.length; i++) {
//         const critere = this.listeCritere[i];
//         const valeur = this.tempVal[critere.id.toString()];
//         if (critere.type === 'ok/nok' && valeur !== 'ok') {
//           console.log(`La valeur du critère "${critere.nom}" doit être 'ok'`);
//           // Si une valeur est invalide, mettre à jour isValid à false
//           isValid = false;
//           console.log("isValid  dans fonction 1 : => ",isValid)
        
//         } else if (critere.type === 'valeur') {
//           // Vérification pour les critères de type 'valeur' avec une valeur spécifiée
//           const numericValue = parseFloat(valeur);
//           if (numericValue < parseFloat(critere.min.toString()) || numericValue > parseFloat(critere.max.toString())) {
//             // Si la valeur est hors des limites, mettre à jour isValid à false
//             console.log(`La valeur du critère "${critere.nom}" doit être un nombre entre ${critere.min} et ${critere.max}`);
//             isValid = false;
//             console.log("isValid  dans fonction 2 : => ",isValid)
//           }
//         }
//       }
//       console.log("isValid fonction : => ",isValid)
//       // Retourner la valeur de isValid à la fin de la fonction
//       observer.next(isValid);
//       observer.complete();
//     });
//   });
// }


validateMesureOKD(): Observable<{isValid: boolean, invalidValues: string}> {
  return new Observable<{isValid: boolean, invalidValues: string}>((observer) => {
    let isValid = true; // Initialiser la variable isValid à true au début de la validation
    let invalidValues: string = ''; // Initialiser la variable pour stocker les valeurs invalides de mesureNC

    this.service.getCritereByOkdId(this.okd.id).subscribe(liste=>{
      this.listeCritere=liste
      this.nbCritere=this.listeCritere.length

      for (let i = 0; i < this.listeCritere.length; i++) {
        const critere = this.listeCritere[i];
        const valeur = this.tempVal[critere.id.toString()];
        console.log("la valeur enregistrer est : ",valeur)
        if (critere.type === 'ok/nok' && valeur !== 'ok') {
          console.log(`La valeur du critère "${critere.nom}" doit être 'ok'`);
          isValid = false;
          console.log("isValid  dans fonction 1 : => ",isValid);
          invalidValues += '<br>'+ critere.nom+" : "+critere.mesureNC;
        } else if (critere.type === 'valeur') {
          const numericValue = parseFloat(valeur);
          if (numericValue < parseFloat(critere.min.toString()) || numericValue > parseFloat(critere.max.toString())) {
            
            console.log(`La valeur du critère "${critere.nom}" doit être un nombre entre ${critere.min} et ${critere.max}`);
            isValid = false;
            console.log("isValid  dans fonction 2 : => ",isValid);
           
            invalidValues +='<br>'+critere.nom+" : "+critere.mesureNC;
          }
        }
      }
      console.log("isValid fonction : => ",isValid);
      console.log("Valeurs invalides ==>MSGS  : ", invalidValues);
      observer.next({isValid: isValid, invalidValues: invalidValues});
      observer.complete();
    });
  });
}

// verifierConformiteOKD(id: number): void {
//   // Récupérer les deux dernières MesureOKD
//   this.service.getMesureOKDByOKDId(id).subscribe(mesures => {
//     this.listemesureOKD = mesures.reverse();

//     if (this.listemesureOKD.length >= 2) {
//       const lastMesure1 = this.listemesureOKD[0];
//       const lastMesure2 = this.listemesureOKD[1];

//       // Parcourir chaque critère
//       for (let i = 0; i < this.listeCritere.length; i++) {
//         const critere = this.listeCritere[i];
        
//         // Récupérer les valeurs des deux dernières MesureOKD pour ce critère
//         const valeur1 = lastMesure1.val[critere.id.toString()];
//         const valeur2 = lastMesure2.val[critere.id.toString()];

//         // Vérifier si les valeurs sont non conformes
//         if (critere.type === 'ok/nok' && (valeur1 !== 'ok' || valeur2 !== 'ok')) {
//           console.log(`La valeur du critère "${critere.nom}" doit être 'ok' pour les deux dernières MesureOKD`);
//           this.ConformAjoutOKD=false
//           // Traitez le cas où les valeurs ne sont pas conformes
//         } else if (critere.type === 'valeur') {
//           const numericValue1 = parseFloat(valeur1);
//           const numericValue2 = parseFloat(valeur2);
//           if ((numericValue1 < parseFloat(critere.min.toString()) || numericValue1 > parseFloat(critere.max.toString())) &&
//               (numericValue2 < parseFloat(critere.min.toString()) || numericValue2 > parseFloat(critere.max.toString()))) {
//               this.ConformAjoutOKD=false
//               console.log(`La valeur du critère "${critere.nom}" doit être un nombre entre ${critere.min} et ${critere.max} pour les deux dernières MesureOKD`);
//             // Traitez le cas où les valeurs ne sont pas conformes
//           }
//         }
//       }
//     }
//   });
// }
// verifierConformiteOKD(id: number): Observable<boolean> {
//   return new Observable<boolean>((observer) => {
//     // Récupérer les deux dernières MesureOKD
//     this.service.getMesureOKDByOKDId(id).subscribe(mesures => {
//       this.listemesureOKD = mesures.reverse();
//       let ConformAjoutOKD = true; // Initialiser à true par défaut

//       if (this.listemesureOKD.length >= 2) {
//         const lastMesure1 = this.listemesureOKD[0];
//         const lastMesure2 = this.listemesureOKD[1];
//        if(lastMesure1.etatactive==false &&lastMesure2.etatactive==false){
//         console.log("lastMesure1.etatactive",lastMesure1.etatactive ," ; lastMesure2.etatactive=",lastMesure2.etatactive)
//         for (let i = 0; i < this.listeCritere.length; i++) {
//           const critere = this.listeCritere[i];
          
         
//           const valeur1 = lastMesure1.val[critere.id.toString()];
//           const valeur2 = lastMesure2.val[critere.id.toString()];

         
//           if (critere.type === 'ok/nok' && (valeur1 !== 'ok' || valeur2 !== 'ok')) {
//             ConformAjoutOKD = false;
            
//           } else if (critere.type === 'valeur') {
//             const numericValue1 = parseFloat(valeur1);
//             const numericValue2 = parseFloat(valeur2);
//             if ((numericValue1 < parseFloat(critere.min.toString()) || numericValue1 > parseFloat(critere.max.toString())) &&
//                 (numericValue2 < parseFloat(critere.min.toString()) || numericValue2 > parseFloat(critere.max.toString()))) {
//               ConformAjoutOKD = false;
              
//             }
//           }
//         }
//       }}
      
//       observer.next(ConformAjoutOKD);
//       observer.complete();
//     });
//   });
// }
verifierConformiteOKD(id: number): Observable<boolean> {
  return new Observable<boolean>((observer) => {
    // Récupérer les deux dernières MesureOKD
    this.service.getMesureOKDByOKDId(id).subscribe(mesures => {
      this.listemesureOKD = mesures.reverse();
      let nombreNonConformitesSuccessives = 0; // Compteur de non-conformités successives
      let ConformAjoutOKD = true; // Initialiser à true par défaut

      if (this.listemesureOKD.length >= 2) {
        const lastMesure1 = this.listemesureOKD[0];
        const lastMesure2 = this.listemesureOKD[1];

        if (!lastMesure1.etatactive && !lastMesure2.etatactive&&!lastMesure2.etatvalide) {
          // Les deux dernières mesures sont inactives
          for (let i = 0; i < this.listeCritere.length; i++) {
            const critere = this.listeCritere[i];
            const valeur1 = lastMesure1.val[critere.id.toString()];
            const valeur2 = lastMesure2.val[critere.id.toString()];

            if (critere.type === 'ok/nok' && (valeur1 !== 'ok' || valeur2 !== 'ok')) {
              nombreNonConformitesSuccessives++;
            } else if (critere.type === 'valeur') {
              const numericValue1 = parseFloat(valeur1);
              const numericValue2 = parseFloat(valeur2);
              if ((numericValue1 < parseFloat(critere.min.toString()) || numericValue1 > parseFloat(critere.max.toString())) &&
                  (numericValue2 < parseFloat(critere.min.toString()) || numericValue2 > parseFloat(critere.max.toString()))) {
                nombreNonConformitesSuccessives++;
              }
            }
          }
        }

        // Si le nombre de non-conformités successives est égal à zéro, alors c'est conforme
        if (nombreNonConformitesSuccessives === 0) {
          ConformAjoutOKD = true;
        } else if(nombreNonConformitesSuccessives != 0 && lastMesure1.etatvalide==true){
          ConformAjoutOKD = true;
        }else{
          ConformAjoutOKD = false;
        }
      }

      observer.next(ConformAjoutOKD);
      observer.complete();
    });
  });
}


LoadMesureByOKD(id:number){
  this.service.getMesureOKDByOKDId(id).subscribe(mesure=>{
  this.listemesureOKD=mesure.reverse();
  console.log(this.listemesureOKD)
  this.sourceMesureOKD = new LocalDataSource(this.listemesureOKD) 
  })
  }
 LoadMesureByCC(id:number){
  this.service.getMesureCCByCarteId(id).subscribe(mesure=>{
    this.listeMesure=mesure.reverse()
     console.log("Mesure cc : ",mesure)
     this.sourceMesure.load(mesure);
   })
 }
  getOperateurById(id:number): string {
    this.service.getUserById(id).subscribe(user=>{
      this.utilisateur=user 
     })
     return  this.utilisateur?.username!.toString()+" "+this.utilisateur?.prenom!.toString();

}
getMinCarteById(id:number): string {
  this.service.getCCById(id).subscribe(carte=>{
    this.carte=carte 
   })
   return  this.carte.min!.toString() 
}
getMaxCarteById(id:number): string {
  this.service.getCCById(id).subscribe(carte=>{
    this.carte=carte  
   })
   return  this.carte.max!.toString()  
}


/************************************ Extraction Données EXCEL ************************************** */
// transformDataCCForExport(data: MesureCC[]): any[] {
//   return data.map(mesure => ({
//     'ID': mesure.id,
//     'Résultat': mesure.resultat,
//     'Commentaire': mesure.Commentaire,
//     'Date': mesure.date,
//     'Motif Saisie': mesure.motif_saisie,
//     'Opérateur ID': mesure.operateur,
//     'Opérateur Nom': mesure.operateurNom,
//     'Qualiticien ID': mesure.qualiticien,
//     'Qualiticien Nom': mesure.qualiticienNom,
//     'État Validation': mesure.etatactive,
//     'Carte ID': mesure.carte?.id,
//     'Carte Nom': mesure.carte?.nom,
//     'Valeur': JSON.stringify(mesure.val)
//   }));
// }
transformDataCCForExport(data: MesureCC[]): any[] {
  return data.map(mesure => {
    const transformedData: any = {
      'ID': mesure.id,
      'Résultat': mesure.resultat,
      'Commentaire': mesure.commentaire,
      'Date': mesure.date,
      'Motif Saisie': mesure.motif_saisie,
      'Opérateur ID': mesure.operateur,
      'Opérateur Nom': mesure.operateurNom,
      'Qualiticien ID': mesure.qualiticien,
      'Qualiticien Nom': mesure.qualiticienNom,
      'État Conformité': mesure.etatactive,
      'État Validation': mesure.etatvalide,
      'Carte ID': mesure.carte?.id,
      'Carte Nom': mesure.carte?.nom
    };

    // Itérer sur chaque élément du tableau val et l'ajouter à transformedData
    mesure.val.forEach((valeur, index) => {
      transformedData[`Mesure  ${index + 1}`] = valeur;
    });

    return transformedData;
  });
}



exportCCToExcel(id: number): void {
  this.service.getMesureCCByCarteId(id).subscribe(mesure => {
    this.listeMesure = mesure.reverse();
    console.log("Mesure cc : ", mesure);

    const transformedData = this.transformDataCCForExport(this.listeMesure);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(transformedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* Sauvegarder le fichier */
    XLSX.writeFile(wb, "MesureCC"+id+".xlsx");
  });
}


// transformDataForExportOKD(data: MesureOKD[]): any[] {
//   return data.map(mesure => {
//     const transformedMesure: any = {
//       'ID': mesure.id,
//       'Commentaire': mesure.Commentaire,
//       'Date Ajout': mesure.date_add,
//       'Date Modification': mesure.date_modif,
//       'Événement': mesure.evenement,
//       'Équipe': mesure.equipe,
//       'Nom Opérateur': mesure.operateurNom,
//       'Prénom Opérateur': mesure.operateurPrenom,
//       'Nom Qualiticien': mesure.qualiticienNom,
//       'Prénom Qualiticien': mesure.qualiticienPrenom,
//       'État Validation': mesure.etatactive,
//       'OKD REF': mesure.okd?.ref,
//       'OKD Nom': mesure.okd?.nom,
//     };

//     for (const key in mesure.val) {
//       if (mesure.val.hasOwnProperty(key)) {
//         transformedMesure[`Valeur ${key}`] = mesure.val[key];
//       }
//     }

//     return transformedMesure;
//   });
// }

// transformDataForExportOKD(data: MesureOKD[]): any[] {
//   return data.map(mesure => {
//     // Extraction des valeurs du champ val
//     const valKeys = Object.keys(mesure.val);
//     const valData = valKeys.reduce((acc, key) => {
//       acc[`Critére ${key}`] = mesure.val[key];
//       return acc;
//     }, {});

//     return {
//       'ID': mesure.id,
//       'Commentaire': mesure.Commentaire,
//       'Date Ajout': mesure.date_add,
//       'Date Modification': mesure.date_modif,
//       'Événement': mesure.evenement,
//       'Équipe': mesure.equipe,
//       'Nom Opérateur': mesure.operateurNom,
//       'Prenom Opérateur': mesure.operateurPrenom,
//       'Nom qualiticien': mesure.qualiticienNom,
//       'Prenom qualiticien': mesure.qualiticienPrenom,
//       'État Validation': mesure.etatactive,
//       'OKD ID': mesure.okd?.id,
//       'OKD REF': mesure.okd?.ref,
//       'OKD Nom': mesure.okd?.nom,
//       ...valData  // Ajoute les valeurs extraites du champ val
//     };
//   });
// }


transformDataForExportOKD(data: MesureOKD[]): Observable<any[]> {
  const observables = data.map(mesure =>
    forkJoin(
      Object.keys(mesure.val).map(key =>
        this.service.getCritereById(parseInt(key)).pipe(
          map(critere => ({ key, critere })),
          catchError(error => of({ key, critere: null }))
        )
      )
    ).pipe(
      map(criteres => {
        const valData = {};
        criteres.forEach(({ key, critere }) => {
          if (critere) {
            valData[`${critere.nom}`] = mesure.val[key];
          } else {
            valData[`Critère inconnu`] = mesure.val[key];
          }
        });
        return {
          'ID': mesure.id,
          'Commentaire': mesure.commentaire,
          'Date Ajout': mesure.date_add,
          'Date Modification': mesure.date_modif,
          'Événement': mesure.evenement,
          'Équipe': mesure.equipe,
          'Nom Opérateur': mesure.operateurNom,
          'Prenom Opérateur': mesure.operateurPrenom,
          'Nom qualiticien': mesure.qualiticienNom,
          'Prenom qualiticien': mesure.qualiticienPrenom,
          'État Conformité': mesure.etatactive,
          'État Validation': mesure.etatvalide,
          'OKD ID': mesure.okd?.id,
          'OKD REF': mesure.okd?.ref,
          'OKD Nom': mesure.okd?.nom,
          ...valData
        };
      })
    )
  );

  return forkJoin(observables);
}

exportOKDToExcel(id: number): void {
  this.service.getMesureOKDByOKDExportId(id).subscribe(async mesure => {
    this.listemesureOKD = mesure.reverse();
    console.log("okd possedeé ........ : ", mesure);

    const transformedData = await this.transformDataForExportOKD(this.listemesureOKD).toPromise();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(transformedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* Sauvegarder le fichier */
    XLSX.writeFile(wb, "MesureOKD"+id+".xlsx");
  });
}



/********************************************** Progress bar *************************************************** */

getProgressBarWidth(date_fin: string): string {
  // Calculate and return the width of the progress bar based on the qualification status
 const dateFinProc = new Date(date_fin);
   //  console.log("date fin est : ",date_fin)
     const dateSysteme = new Date();
   //  console.log(dateSysteme)
     const troisMoisApres = new Date();
     troisMoisApres.setMonth(dateSysteme.getMonth() + 3);
   //  console.log(troisMoisApres)
     if (dateFinProc > troisMoisApres) {
       return '100%';
     }else if(dateFinProc < dateSysteme){
       return '100%';
     }
      else {
       return '100%';
     }
}



getProgressBarColor(date_fin: string): string {
// Determine and return the color of the progress bar based on the qualification status
 const dateFinProc = new Date(date_fin);
     const dateSysteme = new Date();
     const troisMoisApres = new Date();
     troisMoisApres.setMonth(dateSysteme.getMonth() + 3);
     if (dateFinProc > troisMoisApres) {
       return 'green';
     }else if(dateFinProc < dateSysteme){
       return 'red';
     }
      else {
       return 'orange';
     }


   }


   getEtat(dateFin: string): boolean {
    const dateFinProc = new Date(dateFin);
    const dateSysteme = new Date();
    const troisMoisApres = new Date();
    troisMoisApres.setMonth(dateSysteme.getMonth() + 3);
    if (dateFinProc >= dateSysteme) {
      return true;
    }else{
      return false;
    }
  }
}
