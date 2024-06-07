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
 
 
  }

 

  
  
  
  

  

    
   
}
