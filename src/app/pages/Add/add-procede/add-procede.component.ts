import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Procede } from '../../../Model/Procede.model';
import { CrudService } from '../../../Service/crud.service';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { FormsModule } from '@angular/forms'; 
import { Atelier } from '../../../Model/Atelier.model';
import Swal from 'sweetalert2';
import { Activite } from '../../../Model/Activite.model';
import { LocalDataSource } from 'ng2-smart-table';
import { Files } from '../../../Model/Files.model';

@Component({
  selector: 'ngx-add-procede',
  templateUrl: './add-procede.component.html',
  styleUrls: ['./add-procede.component.scss']
})
export class AddProcedeComponent implements OnInit {
  userFile1:any
  message1?:String
  imgURL1:any
  imagePath1:any

  userFile2:any
  message2?:String
  imgURL2:any
  imagePath2:any

  selectedAtelier: any;
  listeAtelier: Atelier[]=[]
  procede:Procede =new Procede()
  ateliers: Atelier[]=[]
  activites: Activite[] = [];
  selectedActivite: any ;
  id:any;

  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;
  listeAct: Activite[]=[]
  listeA: Atelier[]=[]
  listeProcde:Procede[]=[]
  procedeFin:Procede =new Procede()
  activite:Activite =new Activite()

  r: boolean = true;
  files:any[] = [];
  listfiles: LocalDataSource = new LocalDataSource();
  f: Files = new Files(); // Assurez-vous que la classe File est définie correctement
  lf: any[] = [];

  code: string;
  reference: string;

  constructor( 
    private service:CrudService,
    private route:Router,
    private toastrService: NbToastrService,
    private fb: FormBuilder) { }


  ngOnInit(): void {
  
    this.service.getActivite().subscribe(activites => {
      this.activites = activites;
      console.log("la liste des activites",activites)
    });

    this.service.getAtelier().subscribe(ateliers => {
      this.listeAtelier = ateliers;
      console.log("la liste des ateliers",ateliers)
    });

    //stepper
    this.service.getProcede().subscribe(procede => {
    this.listeProcde = procede;
    console.log("la liste des procedes : ",this.listeProcde)

    this.procedeFin = this.listeProcde.slice(-1)[0];
    console.log("Le dernier élément de la liste : ",  this.procedeFin);
  });
  }


 //Choix Atelier :
  loadActivites() {
      if (this.selectedActivite) {
        this.service.getAteliersByActiviteId(this.selectedActivite).subscribe(at=>{
          this.listeAtelier=at
          console.log(this.listeAct)
      }) 
    }
    this.service.getActiviteById(this.selectedActivite).subscribe(at=>{
      this.activite=at
      console.log(this.activite.nom)
      this.procede.code =this.activite.nom.substring(0, 3) +'-00'+this.procedeFin.id;
      console.log(this.procede.code );

      // this.procede.ref =this.procede.code + '-' + this.procede.rev ;
  }) 
  
    
    }


    SaveProcede(): void {
      if (!this.procede.nom || !this.procede.designation||!this.procede.ref||!this.procede.rev||!this.procede.date_fin||!this.procede.date_init||!this.lf) {
        // Afficher un toast d'erreur
        this.toastrService.danger('Veuillez remplir tous les champs!!', 'Erreur');
        return;
      }
      const dateFinProc = new Date(this.procede.date_fin);
      const datedebProc = new Date(this.procede.date_init);
      // console.log("date deb : ",datedebProc)
      // console.log("date fin : ",dateFinProc)
      // const troisAnsApres = new Date(datedebProc);
      // troisAnsApres.setFullYear(datedebProc.getFullYear() + 3);

      // console.log("Date de début :", datedebProc);
      // console.log("Date de fin :", dateFinProc);
      // console.log("Date de fin attendue après 3 ans de la date de début :", troisAnsApres);
      // Vérifier si la date de fin est égale à 3 ans après la date de début
     // if (dateFinProc.getTime() !== troisAnsApres.getTime()) {
      if (dateFinProc <= datedebProc) {
        this.toastrService.danger('Date Fin  doit etre supérieur à la date debut !!!', 'Erreur');
      }else{

        const formData = new FormData();
        console.log(this.selectedAtelier)
        if (this.selectedAtelier) {
          const siteSelectionne: Atelier = { id: this.selectedAtelier };
          this.procede.atelier=siteSelectionne,
          console.log(siteSelectionne);
          console.log(this.procede); 
          formData.append('procede', new Blob([JSON.stringify(this.procede)], {
    
          type: 'application/json'
            }));
  
          
          if (this.lf.length > 0) {
    
           Array.from(this.lf).forEach(file => {
    
            formData.append('files', file);
    
           });
    
          this.service.addProcede(formData).subscribe(
          (site1) => {
            console.log('Procédé added successfully:', site1);
            Swal.fire({
              title: 'Succès!',
              text: 'L\'ajout a été effectué avec succès.',
              icon: 'success',
              confirmButtonColor: '#0CA417',
              confirmButtonText: 'OK'
            });
            this.route.navigate(["/pages/ProcedeOKD"])
          },
          (error) => {
            console.error('Error adding procédé:', error);
            this.toastrService.danger('Erreur lors de l\'ajout du cette Procédé Spéciale', 'Erreur');
        
          }
        );}
      }
      }

  } 
  uploadFiles(event) {
    this.r = true;
    this.listfiles = new LocalDataSource();
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;

    if (fileList.length > 0) {

      const file: File = fileList[0];
      console.log(file)
 

      const maxSizeInBytes = 20 * 1024 * 1024; // 40MB in bytes

      if (file.size > maxSizeInBytes) {

        this.toastrService.danger('La taille maximale du fichier est 20 MB',  'Erreur')

        return;

      }

    }
    if (fileList) {

      Array.from(fileList).forEach(file => {
        this.lf.push(file);
      });
    } 
    console.log(this.lf)
    this.listfiles = new LocalDataSource(this.lf);     
    this.files = event.target.files;
    // this.lf.push(this.files);
    console.log(this.lf)
  }


 
}
