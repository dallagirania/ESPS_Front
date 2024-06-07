import { Component, OnInit } from '@angular/core';
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
export class PerformanceNCComponent implements OnInit {
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
  getNbConformite() {
    this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur => {
      this.currentuser = utilisateur;
      this.currentuserUnite = this.currentuser.unite.id;
      this.service.LeadTime(this.currentuserUnite).subscribe(res=>{
        console.log("lesdTime",res)
        this.leadTime=res
      })
  
      // Utilisez forkJoin pour attendre que les deux observables soient complétés
      forkJoin({
        mesureOKDCount: this.service.countMesureOKDByUniteId(this.currentuserUnite),
        mesureCCCount: this.service.countMesureCCByUniteId(this.currentuserUnite)
      }).subscribe(results => {
        this.mesureOKDCount = results.mesureOKDCount;
        this.mesureCCCount = results.mesureCCCount;
        this.TotalMesure = this.mesureOKDCount + this.mesureCCCount;
  
        // Vérifiez que TotalMesure n'est pas zéro avant de calculer les pourcentages pour éviter une division par zéro
        if (this.TotalMesure > 0) {
          this.pourcentageCC = parseFloat(((this.mesureCCCount / this.TotalMesure) * 100).toFixed(2));
          this.pourcentageOKD = parseFloat(((this.mesureOKDCount / this.TotalMesure) * 100).toFixed(2));
        } else {
          this.pourcentageCC = 0;
          this.pourcentageOKD = 0;
        }
  
        // Affichage des résultats dans la console
        console.log("TotalMesure = ", this.TotalMesure, ", mesureCCCount : ", this.mesureCCCount, ", mesureOKDCount : ", this.mesureOKDCount);
        console.log("Pourcentage CC = ", this.pourcentageCC, ", Pourcentage OKD = ", this.pourcentageOKD);
      });
    });
  }


  CourbeBar(): void {
    this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur => {
      this.currentuser = utilisateur;
      this.currentuserUnite = this.currentuser.unite.id;
      this.service.getProcedeDernierByUnite(this.currentuserUnite).subscribe(procede => {
        this.liste = procede.reverse();
        this.service.countMesureTotalByProcedeAndMonth(this.liste).subscribe(res => {
          this.createStackedBarChart(res);
        });
      });
    });
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
    this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur => {
      this.currentuser = utilisateur;
      this.currentuserUnite = this.currentuser.unite.id;
      this.service.getProcedeDernierByUnite(this.currentuserUnite).subscribe(procede => {
        this.liste = procede.reverse();
        this.service.countMesureTotalByProcede(this.liste).subscribe(res=>{
          console.log(res)
          this.createPieChart(res);
        })
      });
    });
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


