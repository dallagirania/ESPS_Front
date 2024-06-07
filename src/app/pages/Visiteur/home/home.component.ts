import { Component, OnInit } from '@angular/core';
import { Procede } from '../../../Model/Procede.model';
import { CrudService } from '../../../Service/crud.service';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Site } from '../../../Model/Site.model';

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  show:boolean=false
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
  constructor(
    private service:CrudService,
    private route:Router,
    private toastrService: NbToastrService
    ) {

  }

  ngOnInit(): void {
   this.loadSite();
    this.service.getProcedeDernier().subscribe(procede=>{
      this.liste=procede.reverse()
      this.nbprocede=this.liste.length  
      this.liste2=this.liste
      console.log("liste totale :=> ",this.liste2)
      console.log("longueur du liste totale :=> ",this.liste2.length)
    })
  }  
  
    //verifier date 
    getEtat(dateFin: string): string {
      const dateFinProc = new Date(dateFin);
      const dateSysteme = new Date();
      const troisMoisApres = new Date();
      troisMoisApres.setMonth(dateSysteme.getMonth() + 3);
      console.log(troisMoisApres)
  
      if (dateFinProc > troisMoisApres) {
        return 'Qualifié';
      }else if(dateFinProc < dateSysteme){
        return 'Non Qualifié';
      }
       else {
        return 'A Requalifié';
      }
    }

    /*********************************  Progressive Bar  Qualification PS  ************************************** */

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
  //   console.log("date fin est : ",date_fin)
     const dateSysteme = new Date();
   //  console.log(dateSysteme)
     const troisMoisApres = new Date();
     troisMoisApres.setMonth(dateSysteme.getMonth() + 3);
  //   console.log(troisMoisApres)
     if (dateFinProc > troisMoisApres) {
       return 'green';
     }else if(dateFinProc < dateSysteme){
       return 'red';
     }
      else {
       return 'orange';
     }


   }
 
   Search(){
    if(this.nom !=""){
      this.liste= this.liste.filter(res =>{return res.nom!.toLocaleLowerCase().match(this.nom.toLocaleLowerCase());});   
    }else{
      this.liste=this.liste2
    }
  }
 
  selectedSite: string | null = null;
  selectedUnite: string | null = null;
  
  listeProcedefinal = [];
  listeUnit = [];

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
  }
  loadProcedes() {
    if (this.selectedUnite) {
      this.show=true
      console.log('Loading procedes for unit:', this.selectedUnite); // Log de débogage
      this.service.getProcedeDernierByUnite(parseInt(this.selectedUnite)).subscribe(at => {
        this.listeProcedefinal = at.reverse();
        console.log('Procedes loaded:', this.listeProcedefinal); // Log de débogage
      });
    }
  }
  }
