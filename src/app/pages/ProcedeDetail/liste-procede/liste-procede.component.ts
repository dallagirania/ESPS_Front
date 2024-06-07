import { Component, OnInit } from '@angular/core';
import { Procede } from '../../../Model/Procede.model';
import { CrudService } from '../../../Service/crud.service';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-liste-procede',
  templateUrl: './liste-procede.component.html',
  styleUrls: ['./liste-procede.component.scss']
})
export class ListeProcedeComponent implements OnInit {

  liste:Procede[]=[]
  liste2:Procede[]=[]
  liste3:Procede[]=[]
  nom:any
  page :number=1
  nbprocede:number
  procede:Procede=new Procede()
  currentuser:any
  currentuserUnite:number
  constructor(
    private service:CrudService,
    private route:Router,
    private toastrService: NbToastrService
    ) {

  }

  ngOnInit(): void {
    this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur=>{
      this.currentuser=utilisateur
      this.currentuserUnite=this.currentuser.unite.id  
      this.service.getProcedeDernierByUnite(this.currentuserUnite).subscribe(procede=>{
        this.liste=procede.reverse()
        this.nbprocede=this.liste.length  
        this.liste2=this.liste
      //   console.log(procede)
      })
      
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

  }