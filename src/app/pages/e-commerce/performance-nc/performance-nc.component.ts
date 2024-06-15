import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NbThemeService, NbToastrService } from '@nebular/theme';
import { CrudService } from '../../../Service/crud.service';
import { Console } from 'console';
import { Subscription, forkJoin } from 'rxjs';
import { Procede } from '../../../Model/Procede.model';
import { re } from 'mathjs';


@Component({
  selector: 'ngx-performance-nc',
  templateUrl: './performance-nc.component.html',
  styleUrls: ['./performance-nc.component.scss']
})
export class PerformanceNCComponent implements OnInit ,OnChanges{
  currentuser:any
  currentuserUnite:any
  mesureOKDCount:number
  mesureCCCount:number
  pourcentageCC:number
  pourcentageOKD:number
  TotalMesure:number
  leadTime:any

  liste:Procede[]=[]
  resultat:any
  chartDataBar:any
  chartDataPie:any
  data: any;
  options: any;
  options1:any
  colors: any;
  chartjs: any;

  private themeSubscription: Subscription;
  resultatTotal:any
  @Input() selectedUnite: number | null;
  @Input() selectedSite: string | null;
  constructor(
    private service: CrudService,
    private router: Router,
    private fb: FormBuilder,
    private theme: NbThemeService,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {
      this.getNbConformite();
      this.CourbeBar();
      this.CourbePie();

  }
  ngOnChanges(changes: SimpleChanges) {
    if  ((changes.selectedUnite && this.selectedUnite)||(changes.selectedSite && this.selectedSite)) {
      this.getNbConformite();
      this.CourbeBar();
      this.CourbePie();
    }
  }
  getNbConformite() {
    if (this.selectedUnite){
      this.service.LeadTime(this.selectedUnite).subscribe(res=>{
        this.leadTime=res
      })
  
      forkJoin({
        mesureOKDCount: this.service.countMesureOKDByUniteId(this.selectedUnite),
        mesureCCCount: this.service.countMesureCCByUniteId(this.selectedUnite)
      }).subscribe(results => {
        this.mesureOKDCount = results.mesureOKDCount;
        this.mesureCCCount = results.mesureCCCount;
        this.TotalMesure = this.mesureOKDCount + this.mesureCCCount;
        if (this.TotalMesure > 0) {
          this.pourcentageCC = parseFloat(((this.mesureCCCount / this.TotalMesure) * 100).toFixed(2));
          this.pourcentageOKD = parseFloat(((this.mesureOKDCount / this.TotalMesure) * 100).toFixed(2));
        } else {
          this.pourcentageCC = 0;
          this.pourcentageOKD = 0;
        }
       });
    }else if(this.selectedSite){
      forkJoin({
        mesureOKDCount: this.service.countMesureOKDBySiteId(parseInt(this.selectedSite)),
        mesureCCCount: this.service.countMesureCCBySiteId(parseInt(this.selectedSite))
      }).subscribe(results => {
        this.mesureOKDCount = results.mesureOKDCount;
        this.mesureCCCount = results.mesureCCCount;
        this.TotalMesure = this.mesureOKDCount + this.mesureCCCount;
        if (this.TotalMesure > 0) {
          this.pourcentageCC = parseFloat(((this.mesureCCCount / this.TotalMesure) * 100).toFixed(2));
          this.pourcentageOKD = parseFloat(((this.mesureOKDCount / this.TotalMesure) * 100).toFixed(2));
        } else {
          this.pourcentageCC = 0;
          this.pourcentageOKD = 0;
        }
         });
    }else if(this.selectedSite=="null"){
      forkJoin({
        mesureOKDCount: this.service.countOKDAll(),
        mesureCCCount: this.service.countCCAll()
      }).subscribe(results => {
        this.mesureOKDCount = results.mesureOKDCount;
        this.mesureCCCount = results.mesureCCCount;
        this.TotalMesure = this.mesureOKDCount + this.mesureCCCount;
        if (this.TotalMesure > 0) {
          this.pourcentageCC = parseFloat(((this.mesureCCCount / this.TotalMesure) * 100).toFixed(2));
          this.pourcentageOKD = parseFloat(((this.mesureOKDCount / this.TotalMesure) * 100).toFixed(2));
        } else {
          this.pourcentageCC = 0;
          this.pourcentageOKD = 0;
        }
     });
    }else{
      forkJoin({
        mesureOKDCount: this.service.countOKDAll(),
        mesureCCCount: this.service.countCCAll()
      }).subscribe(results => {
        this.mesureOKDCount = results.mesureOKDCount;
        this.mesureCCCount = results.mesureCCCount;
        this.TotalMesure = this.mesureOKDCount + this.mesureCCCount;
        if (this.TotalMesure > 0) {
          this.pourcentageCC = parseFloat(((this.mesureCCCount / this.TotalMesure) * 100).toFixed(2));
          this.pourcentageOKD = parseFloat(((this.mesureOKDCount / this.TotalMesure) * 100).toFixed(2));
        } else {
          this.pourcentageCC = 0;
          this.pourcentageOKD = 0;
        }
         });
    }
  }


  CourbeBar(): void {
    if (this.selectedUnite){
      this.service.getProcedeDernierByUnite(this.selectedUnite).subscribe(procede => {
        this.liste = procede.reverse();
        forkJoin({
          resultatTotal: this.service.countMesureTotalByProcedeAndMonth(this.liste)
         
        }).subscribe(results => {
          this.resultatTotal = results.resultatTotal;
          this.createStackedBarChart(this.resultatTotal);
        });
       
      });
      
    } else if(this.selectedSite){
      this.service.getProcedeDernierBySite(parseInt(this.selectedSite)).subscribe(procede => {
        this.liste = procede.reverse();
        forkJoin({
          resultatTotal: this.service.countMesureTotalByProcedeAndMonth(this.liste)
         
        }).subscribe(results => {
          this.resultatTotal = results.resultatTotal;
          this.createStackedBarChart(this.resultatTotal);
        });
       
      });
    }
    
    else if(this.selectedSite=="null"){
      this.service.getProcedeDernier().subscribe(procede => {
        this.liste = procede.reverse();
        forkJoin({
          resultatTotal: this.service.countMesureTotalByProcedeAndMonth(this.liste)
         
        }).subscribe(results => {
          this.resultatTotal = results.resultatTotal;
          this.createStackedBarChart(this.resultatTotal);
        });
       
      });
    }
    else{
      this.service.getProcedeDernier().subscribe(procede => {
        this.liste = procede.reverse();
        forkJoin({
          resultatTotal: this.service.countMesureTotalByProcedeAndMonth(this.liste)
         
        }).subscribe(results => {
          this.resultatTotal = results.resultatTotal;
          this.createStackedBarChart(this.resultatTotal);
        });
       
      });
    }
  }
  
  createStackedBarChart(data: any): void {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.chartjs = config.variables.chartjs;
  
      // Palette de couleurs personnalisée
      const customColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', 
        '#4D5360', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360',
        '#AC64AD', '#F7464A', '#46BFBD', '#FDB45C'
      ];
  
   if (data === null || Object.keys(data).length === 0) {
    this.chartDataBar = null;
    return;
  }
     // Construire les datasets pour les barres empilées
     const datasets = Object.keys(data).map((procede, index) => ({
      label: procede,
      backgroundColor: customColors[index % customColors.length],
      data: Object.values(data[procede]),
    }));
     this.chartDataBar = {
        labels: Object.keys(data[Object.keys(data)[0]]),
        datasets: datasets,
      };
     
  
      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'Suivi Mensuel Des Non-Conformités'
        },
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: {
              display: true,
              color: this.chartjs.axisLineColor,
            },
            ticks: {
              fontColor: this.chartjs.textColor,
            },
          }],
          yAxes: [{
            stacked: true,
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
          position: 'bottom', 
          display: false, // Désactiver l'affichage de la légende
          labels: {
            fontColor: this.chartjs.textColor,
          },
         
        },
      };
    });
  }

  CourbePie(): void {
    if (this.selectedUnite){
      this.service.getProcedeDernierByUnite(this.selectedUnite).subscribe(procede => {
        this.liste = procede.reverse();
        this.service.countMesureTotalByProcede(this.liste).subscribe(res=>{
         
          this.createPieChart(res);
        })
      });}
      else if(this.selectedSite){
        this.service.getProcedeDernierBySite(parseInt(this.selectedSite)).subscribe(procede => {
          this.liste = procede.reverse();
          this.service.countMesureTotalByProcede(this.liste).subscribe(res=>{
         
            this.createPieChart(res);
          })
        });
      }
      else if(this.selectedSite=="null"){
        this.service.getProcedeDernier().subscribe(procede => {
          this.liste = procede.reverse();
          this.service.countMesureTotalByProcede(this.liste).subscribe(res=>{
         
            this.createPieChart(res);
          })
        });
      }
      else{
        this.service.getProcedeDernier().subscribe(procede => {
          this.liste = procede.reverse();
          this.service.countMesureTotalByProcede(this.liste).subscribe(res=>{
            this.createPieChart(res);
          })
        });
      }

  }

  createPieChart(data: any): void {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.chartjs = config.variables.chartjs;

      // Palette de couleurs personnalisée
      const customColors = [
        '#1085B5', '#90F1BE', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', 
        '#4D5360', '#FFCE56', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360',
        '#ED8BEE', '#FFCE56', '#b0f794ba', '#FDB45C'
      ];

      // Préparation des données pour le graphique à secteurs
      const labels = Object.keys(data);
      const values = Object.values(data);

      this.chartDataPie = {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: customColors,
        }],
      };

      this.options1 = {
        responsive: true,
        maintainAspectRatio: false,
       
        legend: {
          position: 'right',
          display: false,
          labels: {
            fontColor: this.chartjs.textColor,
            fontSize: 5,
          },
        },
      };
    });
  }


  
  
  


}


