import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { PredictionService } from '../../../Prediction_Service/prediction.service';
import { CrudService } from '../../../Service/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CarteControle } from '../../../Model/CarteControle.model';

@Component({
  selector: 'ngx-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {

  carte1 :CarteControle=new CarteControle()
  min:number
  max:number
  maximal:number
  ourData:number[]=[]
  forecast: number[] = [];
  lowerBound: number[] = [];
  upperBound: number[] = [];
  url: string = ''; 

  chartDataDiff: any;
  chartColors: any;
  diffOptions: any;
  colors: any;
  chartjs: any;
  id:any
  private themeSubscription: Subscription;

  constructor(private forecastService: PredictionService,
              private theme: NbThemeService,
              private service:CrudService,
              private route:Router,
              private dialogservice: NbDialogService,
              private toastrService: NbToastrService,
              private rout:ActivatedRoute) { }

  ngOnInit(): void {
    this.id=this.rout.snapshot.params["id"];
    this.getForecast(this.id)
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      this.colors = config.variables;
      this.chartjs = config.variables.chartjs;
      this.chartColors = [
        {
          borderColor: 'black',
          backgroundColor: 'rgba(255,99,132,0.2)',
        },
      ];
    });
  }


  getForecast(id:number): void {
    this.service.getCCById(id).subscribe(carte => {
      this.carte1 = carte;
      this.min = parseFloat(this.carte1.min.toString());
      this.max = parseFloat(this.carte1.max.toString());
      if(this.carte1.fonction){
        this.service.getMesureCCPredictionResult(id).subscribe(pred => {
          this.ourData = pred;
          const predData = this.ourData.slice(-30);
      
          this.forecastService.getForecast(id).subscribe(
            data => {
              this.forecast = data.forecast;
              const series1Data = this.forecast;
      
              console.log("Series Data: ", series1Data);
            
              const paddedSeries1Data = new Array(predData.length).fill(null).concat(series1Data);
              if(Math.max(...series1Data)<Math.max(...predData)){
                this.maximal = Math.max(...predData);
              }else{
                 this.maximal = Math.max(...series1Data);
              }
             
              const yMinData = new Array(paddedSeries1Data.length).fill(this.min);
              const yMaxData = new Array(paddedSeries1Data.length).fill(this.max);
              if(this.maximal>this.max){
                const yFinData = new Array(paddedSeries1Data.length).fill(this.maximal + 20);
                this.chartDataDiff = {
                labels: Array.from({ length: paddedSeries1Data.length }, (_, index) => `${index + 1}`), // Create labels for each data point
                datasets: [
                  {
                    data: predData,
                    label: 'Courbe de controle',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: this.colors.primary,
                   
                  },
                  {
                    data: paddedSeries1Data,
                    label: 'Prévision',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: 'rgba(255, 160, 5, 0.5)',
                   
                  },
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
                  }, 
                  {
                    data: yFinData,
                    label: 'Cadre',
                    backgroundColor: 'rgba(252, 181, 178, 0.3)',
                  }],
              };
            }else{
              const yFinData = new Array(paddedSeries1Data.length).fill(this.max + 20);
              this.chartDataDiff = {
                labels: Array.from({ length: paddedSeries1Data.length }, (_, index) => `${index + 1}`), // Create labels for each data point
                datasets: [
                  {
                    data: predData,
                    label: 'Courbe de controle',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: this.colors.primary,
                   
                  },
                  {
                    data: paddedSeries1Data,
                    label: 'Prévision',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: 'rgba(255, 160, 5, 0.5)',
                   
                  },
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
                  }, 
                  {
                    data: yFinData,
                    label: 'Cadre',
                    backgroundColor: 'rgba(252, 181, 178, 0.3)',
                  }],
              };
            }
              this.diffOptions = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  xAxes: [{
                    display: true, // Show the x axis labels
                    gridLines: {
                      display: false,
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
            },
            error => {
              console.error('There was an error!', error);
            }
          );
        });
      }else{
        this.service.getMesureCCPrediction(id).subscribe(pred => {
          this.ourData = pred;
          const predData = this.ourData.slice(-30);
      
          this.forecastService.getForecast(id).subscribe(
            data => {
              this.forecast = data.forecast;
              const series1Data = this.forecast;
      
              console.log("Series Data: ", series1Data);
            
              const paddedSeries1Data = new Array(predData.length).fill(null).concat(series1Data);
              if(Math.max(...series1Data)<Math.max(...predData)){
                this.maximal = Math.max(...predData);
              }else{
                 this.maximal = Math.max(...series1Data);
              }
             
              const yMinData = new Array(paddedSeries1Data.length).fill(this.min);
              const yMaxData = new Array(paddedSeries1Data.length).fill(this.max);
              if(this.maximal>this.max){
                const yFinData = new Array(paddedSeries1Data.length).fill(this.maximal + 20);
                this.chartDataDiff = {
                labels: Array.from({ length: paddedSeries1Data.length }, (_, index) => `${index + 1}`), // Create labels for each data point
                datasets: [
                  {
                    data: predData,
                    label: 'Courbe de controle',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: this.colors.primary,
                   
                  },
                  {
                    data: paddedSeries1Data,
                    label: 'Prévision',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: 'rgba(255, 160, 5, 0.5)',
                   
                  },
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
                  }, 
                  {
                    data: yFinData,
                    label: 'Cadre',
                    backgroundColor: 'rgba(252, 181, 178, 0.3)',
                  }],
              };
            }else{
              const yFinData = new Array(paddedSeries1Data.length).fill(this.max + 20);
              this.chartDataDiff = {
                labels: Array.from({ length: paddedSeries1Data.length }, (_, index) => `${index + 1}`), // Create labels for each data point
                datasets: [
                  {
                    data: predData,
                    label: 'Courbe de controle',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: this.colors.primary,
                   
                  },
                  {
                    data: paddedSeries1Data,
                    label: 'Prévision',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: 'rgba(255, 160, 5, 0.5)',
                   
                  },
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
                  }, 
                  {
                    data: yFinData,
                    label: 'Cadre',
                    backgroundColor: 'rgba(252, 181, 178, 0.3)',
                  }],
              };
            }
              this.diffOptions = {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  xAxes: [{
                    display: true, // Show the x axis labels
                    gridLines: {
                      display: false,
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
            },
            error => {
              console.error('There was an error!', error);
            }
          );
        });
      }
      this.service.getMesureCCPrediction(id).subscribe(pred => {
        this.ourData = pred;
        const predData = this.ourData.slice(-30);
    
        this.forecastService.getForecast(id).subscribe(
          data => {
            this.forecast = data.forecast;
            const series1Data = this.forecast;
    
            console.log("Series Data: ", series1Data);
          
            const paddedSeries1Data = new Array(predData.length).fill(null).concat(series1Data);
            if(Math.max(...series1Data)<Math.max(...predData)){
              this.maximal = Math.max(...predData);
            }else{
               this.maximal = Math.max(...series1Data);
            }
           
            const yMinData = new Array(paddedSeries1Data.length).fill(this.min);
            const yMaxData = new Array(paddedSeries1Data.length).fill(this.max);
            if(this.maximal>this.max){
              const yFinData = new Array(paddedSeries1Data.length).fill(this.maximal + 20);
              this.chartDataDiff = {
              labels: Array.from({ length: paddedSeries1Data.length }, (_, index) => `${index + 1}`), // Create labels for each data point
              datasets: [
                {
                  data: predData,
                  label: 'Courbe de controle',
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  borderColor: this.colors.primary,
                 
                },
                {
                  data: paddedSeries1Data,
                  label: 'Prévision',
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  borderColor: 'rgba(255, 160, 5, 0.5)',
                 
                },
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
                }, 
                {
                  data: yFinData,
                  label: 'Cadre',
                  backgroundColor: 'rgba(252, 181, 178, 0.3)',
                }],
            };
          }else{
            const yFinData = new Array(paddedSeries1Data.length).fill(this.max + 20);
            this.chartDataDiff = {
              labels: Array.from({ length: paddedSeries1Data.length }, (_, index) => `${index + 1}`), // Create labels for each data point
              datasets: [
                {
                  data: predData,
                  label: 'Courbe de controle',
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  borderColor: this.colors.primary,
                 
                },
                {
                  data: paddedSeries1Data,
                  label: 'Prévision',
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  borderColor: 'rgba(255, 160, 5, 0.5)',
                 
                },
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
                }, 
                {
                  data: yFinData,
                  label: 'Cadre',
                  backgroundColor: 'rgba(252, 181, 178, 0.3)',
                }],
            };
          }
            this.diffOptions = {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                xAxes: [{
                  display: true, // Show the x axis labels
                  gridLines: {
                    display: false,
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
          },
          error => {
            console.error('There was an error!', error);
          }
        );
      });
    
    })

  }
  
  
  
}
