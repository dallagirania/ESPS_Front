import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NbThemeService, NbToastrService } from '@nebular/theme';
import { CrudService } from '../../../Service/crud.service';
import { Procede } from '../../../Model/Procede.model';
import { Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'ngx-performance-ps',
  templateUrl: './performance-ps.component.html',
  styleUrls: ['./performance-ps.component.scss']
})
export class PerformancePSComponent implements OnInit ,OnChanges  {
  currentuser:any
  currentuserUnite:number
  liste:Procede[]=[]
  nbprocedeTotal:number
  nbprocedeC:number
  nbprocedeNC:number
  nbprocedeAR:number
  PourcentageprocedeC:number
  PourcentageprocedeNC:number
  PourcentageprocedeAR:number
  ListeResultatMensuel:number[]=[]
  listeResultat: { label: string, value: number }[] = [];

  chartData:any
  chartDataLine:any
  data: any;
  options: any;
  options1:any
  colors: any;
  chartjs: any;
  private themeSubscription: Subscription;

  @Input() selectedUnite: string | null;
  @Input() selectedSite: string | null;
  constructor(
    private service: CrudService,
    private router: Router,
    private fb: FormBuilder,
    private theme: NbThemeService,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {
  console.log("selectedUnite PS",this.selectedUnite)
  console.log("selectedSite PS",this.selectedSite)
  this.CourbePie();
  this.CourbeLine()
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.selectedUnite && this.selectedUnite)||(changes.selectedSite && this.selectedSite)) {
      this.CourbePie();
      this.CourbeLine()
    }
  }
  CourbePie(): void {
    if (this.selectedUnite)
      {
        this.service.getProcedeDernierByUnite(parseInt(this.selectedUnite)).subscribe(procede => {
          this.liste = procede.reverse();
          this.nbprocedeTotal = this.liste.length;
  
          forkJoin({
            nbprocedeC: this.service.countQualifiedProcedes(this.liste),
            nbprocedeNC: this.service.countNonQualifiedProcedes(this.liste),
            nbprocedeAR: this.service.countRequalificationNeededProcedes(this.liste)
          }).subscribe(results => {
            this.nbprocedeC = results.nbprocedeC;
            this.nbprocedeNC = results.nbprocedeNC;
            this.nbprocedeAR = results.nbprocedeAR;
  
            this.PourcentageprocedeC = parseFloat(((this.nbprocedeC / this.nbprocedeTotal) * 100).toFixed(2));
            this.PourcentageprocedeNC = parseFloat(((this.nbprocedeNC / this.nbprocedeTotal) * 100).toFixed(2));
            this.PourcentageprocedeAR = parseFloat(((this.nbprocedeAR / this.nbprocedeTotal) * 100).toFixed(2));
  
            this.listeResultat = [
              { label: 'Ps Qualifiés', value: this.nbprocedeC },
              { label: 'Ps Non Qualifiés', value: this.nbprocedeNC },
              { label: 'Ps A Requalifiés', value: this.nbprocedeAR }
            ];
  
            this.updateChart();
          });
        });
      }else if (this.selectedSite){
        this.service.getProcedeDernierBySite(parseInt(this.selectedSite)).subscribe(procede => {
          this.liste = procede.reverse();
          this.nbprocedeTotal = this.liste.length;
  
          forkJoin({
            nbprocedeC: this.service.countQualifiedProcedes(this.liste),
            nbprocedeNC: this.service.countNonQualifiedProcedes(this.liste),
            nbprocedeAR: this.service.countRequalificationNeededProcedes(this.liste)
          }).subscribe(results => {
            this.nbprocedeC = results.nbprocedeC;
            this.nbprocedeNC = results.nbprocedeNC;
            this.nbprocedeAR = results.nbprocedeAR;
  
            this.PourcentageprocedeC = parseFloat(((this.nbprocedeC / this.nbprocedeTotal) * 100).toFixed(2));
            this.PourcentageprocedeNC = parseFloat(((this.nbprocedeNC / this.nbprocedeTotal) * 100).toFixed(2));
            this.PourcentageprocedeAR = parseFloat(((this.nbprocedeAR / this.nbprocedeTotal) * 100).toFixed(2));
  
            this.listeResultat = [
              { label: 'Ps Qualifiés', value: this.nbprocedeC },
              { label: 'Ps Non Qualifiés', value: this.nbprocedeNC },
              { label: 'Ps A Requalifiés', value: this.nbprocedeAR }
            ];
  
            this.updateChart();
          });
        });

      }
      else if(this.selectedSite=="null"){
        this.service.getProcedeDernier().subscribe(procede=>{
          this.liste=procede.reverse()
          this.nbprocedeTotal = this.liste.length;
  
          forkJoin({
            nbprocedeC: this.service.countQualifiedProcedes(this.liste),
            nbprocedeNC: this.service.countNonQualifiedProcedes(this.liste),
            nbprocedeAR: this.service.countRequalificationNeededProcedes(this.liste)
          }).subscribe(results => {
            this.nbprocedeC = results.nbprocedeC;
            this.nbprocedeNC = results.nbprocedeNC;
            this.nbprocedeAR = results.nbprocedeAR;
  
            this.PourcentageprocedeC = parseFloat(((this.nbprocedeC / this.nbprocedeTotal) * 100).toFixed(2));
            this.PourcentageprocedeNC = parseFloat(((this.nbprocedeNC / this.nbprocedeTotal) * 100).toFixed(2));
            this.PourcentageprocedeAR = parseFloat(((this.nbprocedeAR / this.nbprocedeTotal) * 100).toFixed(2));
  
            this.listeResultat = [
              { label: 'Ps Qualifiés', value: this.nbprocedeC },
              { label: 'Ps Non Qualifiés', value: this.nbprocedeNC },
              { label: 'Ps A Requalifiés', value: this.nbprocedeAR }
            ];
  
            this.updateChart();
          });
        })
      }else{
          this.service.getProcedeDernier().subscribe(procede=>{
            this.liste=procede.reverse()
            this.nbprocedeTotal = this.liste.length;
    
            forkJoin({
              nbprocedeC: this.service.countQualifiedProcedes(this.liste),
              nbprocedeNC: this.service.countNonQualifiedProcedes(this.liste),
              nbprocedeAR: this.service.countRequalificationNeededProcedes(this.liste)
            }).subscribe(results => {
              this.nbprocedeC = results.nbprocedeC;
              this.nbprocedeNC = results.nbprocedeNC;
              this.nbprocedeAR = results.nbprocedeAR;
    
              this.PourcentageprocedeC = parseFloat(((this.nbprocedeC / this.nbprocedeTotal) * 100).toFixed(2));
              this.PourcentageprocedeNC = parseFloat(((this.nbprocedeNC / this.nbprocedeTotal) * 100).toFixed(2));
              this.PourcentageprocedeAR = parseFloat(((this.nbprocedeAR / this.nbprocedeTotal) * 100).toFixed(2));
    
              this.listeResultat = [
                { label: 'Ps Qualifiés', value: this.nbprocedeC },
                { label: 'Ps Non Qualifiés', value: this.nbprocedeNC },
                { label: 'Ps A Requalifiés', value: this.nbprocedeAR }
              ];
    
              this.updateChart();
            });
          })
        
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
          backgroundColor: [ '#91b510d5', '#fa5e43','#FFA005',],
          hoverBackgroundColor: ['#91b510d5','#fa5e43','#FFA005'],
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

  CourbeLine(): void {
    if (this.selectedUnite){
      this.service.getProcedeDernierByUnite(parseInt(this.selectedUnite)).subscribe(procede => {
        this.liste = procede.reverse();
        this.nbprocedeTotal = this.liste.length;

        forkJoin({
          nbprocedeC: this.service.countQualificationProcedesMensuel(this.liste),
        
        }).subscribe(results => {
          this.ListeResultatMensuel = results.nbprocedeC;
          this.updateChartLine();
        });
      });
    } else if (this.selectedSite){
      this.service.getProcedeDernierBySite(parseInt(this.selectedSite)).subscribe(procede => {
        this.liste = procede.reverse();
        this.nbprocedeTotal = this.liste.length;

        forkJoin({
          nbprocedeC: this.service.countQualificationProcedesMensuel(this.liste),
        
        }).subscribe(results => {
          this.ListeResultatMensuel = results.nbprocedeC;
          this.updateChartLine();
        });
      });
     
    }else if (this.selectedSite=="null"){
      this.service.getProcedeDernierBySite(parseInt(this.selectedSite)).subscribe(procede => {
        this.liste = procede.reverse();
        this.nbprocedeTotal = this.liste.length;

        forkJoin({
          nbprocedeC: this.service.countQualificationProcedesMensuel(this.liste),
        
        }).subscribe(results => {
          this.ListeResultatMensuel = results.nbprocedeC;
          this.updateChartLine();
        });
      });
     
    }
    else{
      this.service.getProcedeDernier().subscribe(procede => {
        this.liste = procede.reverse();
        this.nbprocedeTotal = this.liste.length;

        forkJoin({
          nbprocedeC: this.service.countQualificationProcedesMensuel(this.liste),
        
        }).subscribe(results => {
          this.ListeResultatMensuel = results.nbprocedeC;
          this.updateChartLine();
        });
      }); 
    }
    

  }
  updateChartLine(): void {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.colors = config.variables;
      this.chartjs = config.variables.chartjs;

      const series1Data = this.ListeResultatMensuel

      this.chartDataLine = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          data: series1Data,
          label: 'Procédés Spéciaux Qualifiés',
          backgroundColor: 'rgba(145, 181, 16, 0.875)',
          borderColor: 'rgba(145, 181, 16, 1)',
        }]
      };

      this.options1 = {
         
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'Taux Mensuel de Procédés Spéciaux Qualifiés'
        },
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
    });
  }
  }

