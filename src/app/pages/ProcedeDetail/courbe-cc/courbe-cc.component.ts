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
  chartDataRes:any
  chartData1:any
  data: any;
  options: any;
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
    console.log("id mesure Carte Controle : =>",this.id)
    this.service.getCCById(this.id).subscribe(carte => {
      this.carte1 = carte;
      if(this.carte1.fonction) {
        //   console.log("possede fonction : ",this.carte.fonction)
           this.fetchDataResultat(this.carte1.id);
         
       } else {
         //  console.log("Ne possede pas de  fonction : ",this.carte.fonction)
           this.fetchData1(this.carte1.id);
       }
    
    })

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
  

}
