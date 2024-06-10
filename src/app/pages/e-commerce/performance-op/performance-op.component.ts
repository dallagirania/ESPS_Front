import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NbThemeService, NbToastrService } from '@nebular/theme';
import { CrudService } from '../../../Service/crud.service';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { Procede } from '../../../Model/Procede.model';
import { ProcedeFormationCount } from '../../../Model/ProcedeFormationCount.model';

@Component({
  selector: 'ngx-performance-op',
  templateUrl: './performance-op.component.html',
  styleUrls: ['./performance-op.component.scss']
})
export class PerformanceOpComponent implements OnInit ,OnChanges {
  currentuser:any
  currentuserUnite:number
  liste:Procede[]=[]
  nbHabilitationTotal:number
  nbHabilitationC:number
  nbHabilitationNC:number
  nbHabilitationAR:number
  PourcentageHabilitationC:number
  PourcentageHabilitationNC:number
  PourcentageHabilitationAR:number
  listeResultat: { label: string, value: number }[] = [];


   listeValide:ProcedeFormationCount[]=[]
   listeNonValide:ProcedeFormationCount[]=[]
   listeReValide:ProcedeFormationCount[]=[]

  chartData:any
  chartDataBar:any
  data: any;
  options: any;
  options1:any
  colors: any;
  chartjs: any;
  private themeSubscription: Subscription;
  @Input() selectedSite: string | null;
  @Input() selectedUnite: number | null;
  constructor(
    private service: CrudService,
    private router: Router,
    private fb: FormBuilder,
    private theme: NbThemeService,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {
    console.log("selectedUnite OP",this.selectedUnite)
  this.CourbePie();
  this.CourbeBar();

  }
  ngOnChanges(changes: SimpleChanges) {
    if  ((changes.selectedUnite && this.selectedUnite)||(changes.selectedSite && this.selectedSite)) {
      this.CourbePie();
      this.CourbeBar();
    }
  }
 
  CourbePie(): void {
    if (this.selectedUnite){
      this.service.getProcedeDernierByUnite(this.selectedUnite).subscribe(procede => {
        this.liste = procede.reverse();
        forkJoin({
          nbHabilitationTotal: this.service.countHabilitationProcedesTotal(this.liste),
          nbHabilitationC: this.service.countHabilitationProcedesValide(this.liste),
          nbHabilitationAR: this.service.countHabilitationProcedesReValide(this.liste),
          nbHabilitationNC : this.service.countHabilitationProcedesNonValide(this.liste)
        }).subscribe(results => {
          this.nbHabilitationTotal = results.nbHabilitationTotal;
          this.nbHabilitationC = results.nbHabilitationC;
          this.nbHabilitationAR = results.nbHabilitationAR;
          this.nbHabilitationNC=results.nbHabilitationNC

          this.PourcentageHabilitationC = parseFloat(((this.nbHabilitationC / this.nbHabilitationTotal) * 100).toFixed(2));
          this.PourcentageHabilitationNC = parseFloat(((this.nbHabilitationNC / this.nbHabilitationTotal) * 100).toFixed(2));
          this.PourcentageHabilitationAR = parseFloat(((this.nbHabilitationAR / this.nbHabilitationTotal) * 100).toFixed(2));

          this.listeResultat = [
            { label: 'Habilitations Valides', value: this.nbHabilitationC },
            { label: 'habilitations à Renouveller', value: this.nbHabilitationAR },
            { label: 'Habilitations Expirés', value: this.nbHabilitationNC }
          ];

          this.updateChart();
        });
      });
    }
    else if (this.selectedSite){
         this.service.getProcedeDernierBySite(parseInt(this.selectedSite)).subscribe(procede => {
            this.liste = procede.reverse();
            forkJoin({
              nbHabilitationTotal: this.service.countHabilitationProcedesTotal(this.liste),
              nbHabilitationC: this.service.countHabilitationProcedesValide(this.liste),
              nbHabilitationAR: this.service.countHabilitationProcedesReValide(this.liste),
              nbHabilitationNC : this.service.countHabilitationProcedesNonValide(this.liste)
            }).subscribe(results => {
              this.nbHabilitationTotal = results.nbHabilitationTotal;
              this.nbHabilitationC = results.nbHabilitationC;
              this.nbHabilitationAR = results.nbHabilitationAR;
              this.nbHabilitationNC=results.nbHabilitationNC
    
              this.PourcentageHabilitationC = parseFloat(((this.nbHabilitationC / this.nbHabilitationTotal) * 100).toFixed(2));
              this.PourcentageHabilitationNC = parseFloat(((this.nbHabilitationNC / this.nbHabilitationTotal) * 100).toFixed(2));
              this.PourcentageHabilitationAR = parseFloat(((this.nbHabilitationAR / this.nbHabilitationTotal) * 100).toFixed(2));
    
              this.listeResultat = [
                { label: 'Habilitations Valides', value: this.nbHabilitationC },
                { label: 'habilitations à Renouveller', value: this.nbHabilitationAR },
                { label: 'Habilitations Expirés', value: this.nbHabilitationNC }
              ];
    
              this.updateChart();
            });
          });
        }
    else if(this.selectedSite=="null"){
      this.service.getProcedeDernier().subscribe(procede => {
        this.liste = procede.reverse();
        forkJoin({
          nbHabilitationTotal: this.service.countHabilitationProcedesTotal(this.liste),
          nbHabilitationC: this.service.countHabilitationProcedesValide(this.liste),
          nbHabilitationAR: this.service.countHabilitationProcedesReValide(this.liste),
          nbHabilitationNC : this.service.countHabilitationProcedesNonValide(this.liste)
        }).subscribe(results => {
          this.nbHabilitationTotal = results.nbHabilitationTotal;
          this.nbHabilitationC = results.nbHabilitationC;
          this.nbHabilitationAR = results.nbHabilitationAR;
          this.nbHabilitationNC=results.nbHabilitationNC

          this.PourcentageHabilitationC = parseFloat(((this.nbHabilitationC / this.nbHabilitationTotal) * 100).toFixed(2));
          this.PourcentageHabilitationNC = parseFloat(((this.nbHabilitationNC / this.nbHabilitationTotal) * 100).toFixed(2));
          this.PourcentageHabilitationAR = parseFloat(((this.nbHabilitationAR / this.nbHabilitationTotal) * 100).toFixed(2));

          this.listeResultat = [
            { label: 'Habilitations Valides', value: this.nbHabilitationC },
            { label: 'habilitations à Renouveller', value: this.nbHabilitationAR },
            { label: 'Habilitations Expirés', value: this.nbHabilitationNC }
          ];

          this.updateChart();
        });
      });
    }
      else{
        this.service.getProcedeDernier().subscribe(procede => {
          this.liste = procede.reverse();
          forkJoin({
            nbHabilitationTotal: this.service.countHabilitationProcedesTotal(this.liste),
            nbHabilitationC: this.service.countHabilitationProcedesValide(this.liste),
            nbHabilitationAR: this.service.countHabilitationProcedesReValide(this.liste),
            nbHabilitationNC : this.service.countHabilitationProcedesNonValide(this.liste)
          }).subscribe(results => {
            this.nbHabilitationTotal = results.nbHabilitationTotal;
            this.nbHabilitationC = results.nbHabilitationC;
            this.nbHabilitationAR = results.nbHabilitationAR;
            this.nbHabilitationNC=results.nbHabilitationNC
  
            this.PourcentageHabilitationC = parseFloat(((this.nbHabilitationC / this.nbHabilitationTotal) * 100).toFixed(2));
            this.PourcentageHabilitationNC = parseFloat(((this.nbHabilitationNC / this.nbHabilitationTotal) * 100).toFixed(2));
            this.PourcentageHabilitationAR = parseFloat(((this.nbHabilitationAR / this.nbHabilitationTotal) * 100).toFixed(2));
  
            this.listeResultat = [
              { label: 'Habilitations Valides', value: this.nbHabilitationC },
              { label: 'habilitations à Renouveller', value: this.nbHabilitationAR },
              { label: 'Habilitations Expirés', value: this.nbHabilitationNC }
            ];
  
            this.updateChart();
          });
        });
      }

  }

  updateChart(): void {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.colors = config.variables;
      this.chartjs = config.variables.chartjs;

      const series1Data = this.listeResultat.map(item => item.value);

      this.chartData = {
        labels: this.listeResultat.map(item => item.label),
        datasets: [{
          data: series1Data,
          backgroundColor: [ '#91b510d5','#f2bd5be9','#fa5e43'],
          hoverBackgroundColor: ['#91b510d5','#f2bd5be9','#fa5e43'],
          borderWidth: 1,
        }]
      };

      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'left',
        }
      };
    });
  }

  CourbeBar(): void {
  
    if (this.selectedUnite){
      this.service.getProcedeDernierByUnite(this.selectedUnite).subscribe(procede => {
        this.liste = procede.reverse();
        forkJoin({
          listeValide: this.service.getValideFormationCountForQualifiedProcedes(this.liste),
          listeNonValide: this.service.getNonValideFormationCountForQualifiedProcedes(this.liste),
          listeReValide: this.service.getReValideFormationCountForQualifiedProcedes(this.liste),
        }).subscribe(results => {
          this.listeValide = results.listeValide;
          this.listeNonValide = results.listeNonValide;
          this.listeReValide = results.listeReValide;
          this.updateChartBar();
        });
      });
    }else if(this.selectedSite){
      this.service.getProcedeDernierBySite(parseInt(this.selectedSite)).subscribe(procede => {
      this.liste = procede.reverse();
      forkJoin({
        listeValide: this.service.getValideFormationCountForQualifiedProcedes(this.liste),
        listeNonValide: this.service.getNonValideFormationCountForQualifiedProcedes(this.liste),
        listeReValide: this.service.getReValideFormationCountForQualifiedProcedes(this.liste),
      }).subscribe(results => {
        this.listeValide = results.listeValide;
        this.listeNonValide = results.listeNonValide;
        this.listeReValide = results.listeReValide;
        this.updateChartBar();
      });
    });
  }else if(this.selectedSite=="null"){
      this.service.getProcedeDernier().subscribe(procede => {
        this.liste = procede.reverse();
        forkJoin({
          listeValide: this.service.getValideFormationCountForQualifiedProcedes(this.liste),
          listeNonValide: this.service.getNonValideFormationCountForQualifiedProcedes(this.liste),
          listeReValide: this.service.getReValideFormationCountForQualifiedProcedes(this.liste),
        }).subscribe(results => {
          this.listeValide = results.listeValide;
          this.listeNonValide = results.listeNonValide;
          this.listeReValide = results.listeReValide;
          this.updateChartBar();
        });
      });
    }
    else{
      this.service.getProcedeDernier().subscribe(procede => {
        this.liste = procede.reverse();
        forkJoin({
          listeValide: this.service.getValideFormationCountForQualifiedProcedes(this.liste),
          listeNonValide: this.service.getNonValideFormationCountForQualifiedProcedes(this.liste),
          listeReValide: this.service.getReValideFormationCountForQualifiedProcedes(this.liste),
        }).subscribe(results => {
          this.listeValide = results.listeValide;
          this.listeNonValide = results.listeNonValide;
          this.listeReValide = results.listeReValide;
          this.updateChartBar();
        });
      });
    }

   
  }

  updateChartBar(): void {
    this.theme.getJsTheme().subscribe(config => {
      const colors = config.variables;
      const chartjs = config.variables.chartjs || {
      axisLineColor: 'rgba(0, 0, 0, 0.1)',
      textColor: '#000'
    };


      const series1Data = this.listeValide.map(measure => measure.formationCount);
      const series2Data = this.listeNonValide.map(measure => measure.formationCount);
      const series3Data = this.listeReValide.map(measure => measure.formationCount);
      this.chartDataBar = {
        label: 'Suivi Mensuel Des Habilitations',
        labels: this.listeValide.map(measure => measure.procedeNom),
        datasets: [
          {
            data: series1Data,
            label: 'Habilitations Valides',
            backgroundColor: 'rgba(13, 219, 147,1)',
            borderColor: 'rgba(13, 219, 147, 1)',
            borderWidth: 2,
            fill: false
          },
          {
            data: series3Data,
            label: 'Habilitations A Renouveller',
            backgroundColor: 'rgba(255, 179, 23,1)',
            borderColor: 'rgba(255, 179, 23, 1)',
            borderWidth: 2,
            fill: false
          },
          {
            data: series2Data,
            label: 'Habilitations Expirés',
            backgroundColor: 'rgba(255, 78, 122 , 1)',
            borderColor: 'rgba(255, 78, 122, 1)',
            borderWidth: 2,
            fill: false
          },
        ]
      };

      this.options1 = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            stacked: true,
            gridLines: {
              display: true,
            },
            ticks: {
              fontSize:7
            },
          }],
          yAxes: [{
            stacked: true,
            gridLines: {
              display: true,
            },
            ticks: {
              beginAtZero: true,
             
            },
          }],
        },
        legend: {
          labels: {
          },
        },
        title: {
          display: true,
          text: 'Suivie Des Habilitations'
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
    });
  }
}