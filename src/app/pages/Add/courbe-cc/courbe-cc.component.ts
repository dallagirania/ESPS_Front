import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../Service/crud.service';
import { NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';
import { CarteControle } from '../../../Model/CarteControle.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-courbe-cc',
  templateUrl: './courbe-cc.component.html',
  styleUrls: ['./courbe-cc.component.scss']
})



  export class CourbeCCComponent implements OnInit {
    @Input() id: number;
    carte1 :CarteControle=new CarteControle()
    min:number
    max:number
    maximal:number
    chartDataDiff:any
    chartDataDiffRES:any
    chartDataRes:any
    chartData1:any
    data: any;
    options: any;
    diffOptions: any;
    colors: any;
    chartjs: any;
  
    private themeSubscription: Subscription;
    constructor( 
      private router: Router,
      private fb: FormBuilder,
      private rout:ActivatedRoute,
      private service:CrudService,
      private dialogservice: NbDialogService,
      private toastrService: NbToastrService,
      private theme: NbThemeService,
      private layoutService: LayoutService,) { }
  
    ngOnInit(): void {
      this.service.getCCById(this.id).subscribe(carte => {
        this.carte1 = carte;
        if(this.carte1.fonction) {
             this.fetchDataResultat(this.carte1.id);
             this.getResEtendu(this.carte1.id)
         } else {
             this.fetchData1(this.carte1.id);
             this.EtenduVal(this.carte1.id)
         }
      
      })
  
    }
  
    fetchDataResultat(id: number): void {
      this.service.getCCById(id).subscribe(carte => {
        this.carte1 = carte;
        this.min = parseFloat(this.carte1.min.toString());
        this.max = parseFloat(this.carte1.max.toString()); 
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
          this.colors = config.variables;
          this.chartjs = config.variables.chartjs;
    
          this.service.getResultatData(id).subscribe(data => {
    
            if (!data) {
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
              return; 
            }
            if (data.length ==1 ) {
              const yMinData = new Array(2).fill(this.min);
              const yMaxData = new Array(2).fill(this.max);
              const series1 = data.map(measure => measure.value);
              const currentDate = new Date().toLocaleString(); 
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
              return; 
            }
    
            const series1Data = data.map(measure => measure.value);
            this.maximal = Math.max(...series1Data);
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
                    fontSize:7
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
        });
      });
    }
    
    fetchData1(id: number): void {
      this.service.getCCById(id).subscribe(carte => {
        this.carte1 = carte;
        this.min = parseFloat(this.carte1.min.toString());
        this.max = parseFloat(this.carte1.max.toString());
        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
          this.colors = config.variables;
          this.chartjs = config.variables.chartjs;
    
          this.service.getMesureCCData(id).subscribe(data => {
    
            if (!data) {
              const yMinData = new Array(2).fill(this.min);
              const yMaxData = new Array(2).fill(this.max);
              this.chartData1 = {
                labels: ['Label 1', 'Label 2'], 
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
              return; 
            }
            if (data.length < 2) {
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
                    fontSize:7
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
        });
      });
    }
    
    /************************************ Courbe Etendu ********************************************************************* */
    
  
  
  EtenduVal(id: number): void {
    this.service.getCCById(id).subscribe(carte => {
      this.carte1 = carte;
      this.min = parseFloat(this.carte1.min.toString());
      this.max = parseFloat(this.carte1.max.toString());
  
      this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
        this.colors = config.variables;
        this.chartjs = config.variables.chartjs;
  
        this.service.getValEtendu(id).subscribe(data => {
          // Directly use the data array as series1Data
          const series1Data = data;
          this.maximal = Math.max(...series1Data);
          const yMinData = new Array(data.length).fill(this.min);
          const yMaxData = new Array(data.length).fill(this.max);
          const yFinData = new Array(data.length).fill(this.max + 20);
          if (series1Data.length === 0) {
           
            return;
          }
  
          this.chartDataDiff = {
            labels: series1Data.map((_, index) => `mesure ${index + 1}`), // Labels for each data point
            datasets: [{
              data: series1Data,
              label: 'Courbe de controle',
              backgroundColor: 'rgba(115, 199, 7, 0.5)', 
              borderColor: 'rgba(115, 199, 7, 0.5)',
              borderWidth: 1,
            },
           
          ],
          };
  
          this.diffOptions = {
            type: 'line', // Explicitly specify the chart type
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              xAxes: [{
                display: true, // Show the x axis labels
                gridLines: {
                  display: false,
                 
                },
                ticks: {
                  fontColor: this.chartjs.textColor,
                  fontSize:7
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
              display: true, // Show the legend
            },
            plugins: {
              zoom: {
                zoom: {
                  wheel: {
                    enabled: true,
                  },
                  pinch: {
                    enabled: true,
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
      });
    });
  }
  getResEtendu(id: number): void {
    this.service.getCCById(id).subscribe(carte => {
      this.carte1 = carte;
      this.min = parseFloat(this.carte1.min.toString());
      this.max = parseFloat(this.carte1.max.toString());
  
      this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
        this.colors = config.variables;
        this.chartjs = config.variables.chartjs;
  
        this.service.getResEtendu(id).subscribe(data => {
        
         
          const series1Data = data;
          this.maximal = Math.max(...series1Data);
          const yMinData = new Array(data.length).fill(this.min);
          const yMaxData = new Array(data.length).fill(this.max);
          const yFinData = new Array(data.length).fill(this.max + 20);
         
  
          if (series1Data.length === 0) {
            return;
          }
  
          this.chartDataDiffRES = {
            labels: series1Data.map((_, index) => `mesure ${index + 1}`), // Labels for each data point
            datasets: [{
              data: series1Data,
              label: 'Courbe de controle',
              backgroundColor: 'rgba(115, 199, 7, 0.5)', 
              borderColor: 'rgba(115, 199, 7, 0.5)',
              borderWidth: 1,
            },
           
          ],
          };
  
          this.diffOptions = {
            type: 'line', // Explicitly specify the chart type
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              xAxes: [{
                display: true, // Show the x axis labels
                gridLines: {
                  display: false,
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
              display: true, // Show the legend
            },
            plugins: {
              zoom: {
                zoom: {
                  wheel: {
                    enabled: true,
                  },
                  pinch: {
                    enabled: true,
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
      });
    });
  }
  
  }
  