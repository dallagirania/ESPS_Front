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
import { Site } from '../../Model/Site.model';

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent  implements OnInit  {
  liste:Procede[]=[]
  liste2:Procede[]=[]
  liste3:Procede[]=[]
  listepro:Procede[]=[]
  nom:any
  selectedUn: any;
  page :number=1
  nbprocede:number
  procede:Procede=new Procede()
  currentuser:any
  currentuserUnite:number
  listeSite:Site[]=[]
  selectedSite: string | null = null;
  selectedUnite: string | null = null;
  
  listeProcedefinal = [];
  listeUnit = [];
  show:boolean=false
  constructor( private service:CrudService,
    private route:Router,
    private dialogservice: NbDialogService,
    private toastrService: NbToastrService,
    private theme: NbThemeService,
    private layoutService: LayoutService){ 

    }
  ngOnInit(): void {
 this.loadSite();
  }

  loadSite(){
    this.service.getSite().subscribe(site=>{
      this.listeSite=site
    })
  }
  loadUnite() {
    if (parseInt(this.selectedSite)) {
      this.service.getUniteBySite(parseInt(this.selectedSite)).subscribe(unite=>{
        this.listeUnit = unite;
      })
     
    } else {
      this.listeUnit = [];
    }
    this.selectedUnite = null;
    this.show = this.selectedSite !== null;
  }
  loadData() {
    if (this.selectedUnite) {
      this.show=true
    }
  }

 

  
  
  
  

  

    
   
}
