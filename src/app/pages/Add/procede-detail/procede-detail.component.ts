import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { CrudService } from '../../../Service/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { Procede } from '../../../Model/Procede.model';
import { OKD } from '../../../Model/OKD.model';
import { CarteControle } from '../../../Model/CarteControle.model';
import { Critere } from '../../../Model/Critere.model';
import { Habilitation } from '../../../Model/Habilitation.model';
import { log } from 'console';
import { Formation } from '../../../Model/Formation.model';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import { ModFormation } from '../../../Model/ModFormation.model';
import { Utilisateur } from '../../../Model/Utilisateur.model';


@Component({
  selector: 'ngx-procede-detail',
  templateUrl: './procede-detail.component.html',
  styleUrls: ['./procede-detail.component.scss']
})
export class ProcedeDetailComponent implements OnInit, ViewCell {

  idP:any; 
  currentProcede= new Procede()
  mydate=new Date()
  day = this.mydate.getDate();
  month = this.mydate.getMonth() + 1; // Les mois commencent à 0
  year = this.mydate.getFullYear();
  dateAjour:string
  critere= new Critere()
  listeUser:Utilisateur[]=[]
  user:Utilisateur=new Utilisateur()
  listeFormation:Formation[]=[]
  modFormations:ModFormation[]=[]
  formations:Formation[]=[]
  listeCarte:CarteControle[]=[]

  qualitIds: number[] = [];
  habilitation:Habilitation=new Habilitation()
  ListeCriteres:Critere[]=[]

  listeOKDAvecCriteres = [];

  renderValue: string;
  estQualifie: boolean
  imageUrl: string;
  etatQualif:string;
  @Input() value: string;

  @Input() rowData: any;

  id:any
  societe="SAFRAN"
  tel="72 852 369"
  fax="72 369 852"
  isLoading1:boolean
  constructor(
    private service: CrudService,
     private router: Router,
     private fb: FormBuilder,
     private toastrService: NbToastrService,
     private rout:ActivatedRoute
  ) { }



  ngOnInit(): void {
    this.idP=this.rout.snapshot.params["id"];
  //   this.renderValue = this.value;
  //  console.log("====> " + this.value );
  this.dateAjour= `${this.day.toString().padStart(2, '0')}/${this.month.toString().padStart(2, '0')}/${this.year}`;

  this.service.getHabilitationById( this.idP).subscribe(liste => {
    console.log("test");
    this.habilitation=liste;
    console.log(liste);

    //recupérer le PS 
    this.service.getProcedeById(this.habilitation.procede.id).subscribe(liste => {
      console.log("test");
      this.currentProcede=liste;
      console.log(this.currentProcede);
    });
    //Recupérer les qualiticien responsable :
    this.service.getFormationByHabilitationId(this.habilitation.id).subscribe(liste => {
      console.log("test");
      this.formations=liste.reverse();
      console.log("liste formation : ",this.formations); 
      this.formations.forEach(formation => {
        this.qualitIds.push(formation.qualit_id);
        console.log("Qualiticiens formations", this.qualitIds)

        this.service.getModFormationByFormationId(formation.id).subscribe(liste => {
          console.log("test");
          this.modFormations=liste.reverse();
          console.log("liste formation : ",this.formations); 
          this.modFormations.forEach(mod => {
            this.qualitIds.push(mod.qualit_id);
            console.log("Qualiticiens mod formation", this.qualitIds,this.qualitIds.length)
            for (let i = 0; i < this.qualitIds.length; i++) {
              const qualitId = this.qualitIds[i];
              if(qualitId!=0){
                this.service.getUserById(qualitId).subscribe(liste => {
                  console.log("test");
                  this.user=liste;
                  this.listeUser.push(this.user);
                  const uniqueUserSet = new Set(this.listeUser.map(user => user.id));
                  this.listeUser = Array.from(uniqueUserSet).map(userId => this.listeUser.find(user => user.id === userId));
               
                });
              }
             console.log("liste qualités impliquées : ",this.listeUser)   
               }
          });
        });
       
      });
      
    });
  
   
  });

   this.service.getFormationByAcce(this.idP).subscribe(liste => {
    console.log("test");
    this.listeFormation=liste.reverse();
    console.log("liste formation : ",this.listeFormation); 
    

  });
}


downloadPdf() {

  this.isLoading1 = true; // Afficher le loader

  const content = document.getElementById('contentToConvert');

 // const nomFile = this.type + "_" + this.d.nom + "_" + this.d.prenom;
 const nomFile ="test";



  // Ajoutez un élément pour simuler le footer

  const footerContent = document.createElement('div');

 footerContent.innerHTML = `
   <div style="margin-top: 70px;flex-direction: row">
      <div style="text-align: left; font-family: 'Times New Roman', serif; font-size: 15px;">Responsable Qualification</div>
      <div style="text-align:right ; font-family: 'Times New Roman', serif; font-size: 15px;">Responsable Formation</div>
  </div>

  `;

  content.appendChild(footerContent);



  const options = {

    margin: [10, 10], // set left and right margins to 10mm

    filename: nomFile + '.pdf',

    image: { type: 'png' },

    html2canvas: { dpi: 300, letterRendering: true },

    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },

    style: `

        @media all {

          * {

            font-family: "Times New Roman", serif !important;

          }

        }

      `

  };



  html2pdf().from(content).set(options).save().then(() => {

    // Supprimez le contenu du pied de page après la génération du PDF

 //   content.removeChild(footerContent);

    this.isLoading1 = false; // Hide the loader after PDF generation is complete

  });

}

}
