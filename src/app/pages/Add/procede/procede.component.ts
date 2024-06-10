import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { CrudService } from '../../../Service/crud.service';
import { Procede } from '../../../Model/Procede.model';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PontComponent } from '../pont/pont.component';
import { DownloadButtonComponent } from '../download-button/download-button.component';
import { HistoriqueProcedeComponent } from '../historique-procede/historique-procede.component';


@Component({
  selector: 'ngx-procede',
  templateUrl: './procede.component.html',
  styleUrls: ['./procede.component.scss']
})
export class ProcedeComponent implements OnInit {
  renderValue: string;
  settings = {
    noDataMessage: 'Liste des Procédés Spéciaux est vide',

    mode: "external",
  
    actions: {
      add: true,
  
      edit: true,
  
      delete: true,  
      position: 'right',
  
  
  
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      ref: {
        title: 'Référence',
        type: 'String',
      },
    //   atelier: {
    //     title: 'Atelier',
    //     type: 'string',
    //     valuePrepareFunction: (atelier) => { return (atelier?.nom); },
    // },
      nom: {
        title: 'Nom',
        type: 'string',
      },
      date_init: {
        title: 'Date Début',
        type: 'string',
      },
      date_fin: {
        title: 'Date Fin',
        type: 'string',
      },
      etat: {
        title: 'Etat',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
         // console.log(row.date_fin)
          const etat =this.getEtat(row.date_fin);
          if(etat=="Qualifié"){
         //   console.log(this.getEtat(row.date_fin))
             return "<p class='text-success'>Qualifié</p>"
           }else if(etat=="Non Qualifié")
            {
              return "<p class='text-danger'>Non Qualifié</p>"
            }else{
          //  console.log(this.getEtat(row.date_fin))
            return "<p class='text-warning'>A Requalifié</p>"
          }
       },
       
      },
      id: {
        title: 'Détails',
        type: 'custom',
        filter: false,
        valuePrepareFunction: (cell, row) => cell,
        renderComponent: PontComponent
      },
      Historique: {
        title: 'Historique',
        type: 'custom',
        filter: false,
        valuePrepareFunction: (cell, row) => row.id, // Utilisez row.id au lieu de cell.id
        renderComponent: HistoriqueProcedeComponent, 
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  listeProcede:Procede[]=[]
  liste:Procede[]=[]
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
        this.listeProcede=procede.reverse()
          this.source.load(procede);
      })
    })
  }     
  LoadProcedes(){
    this.service.getUserById(this.service.userDetail().id).subscribe(utilisateur=>{
      this.currentuser=utilisateur
      this.currentuserUnite=this.currentuser.unite.id  
      this.service.getProcedeDernierByUnite(this.currentuserUnite).subscribe(procede=>{
        this.liste=procede.reverse();
        this.listeProcede=procede;
        this.source = new LocalDataSource(this.liste) 
      })
    })
    }
    //verifier date 
    getEtat(dateFin: string): string {
      const dateFinProc = new Date(dateFin);
      const dateSysteme = new Date();
      const troisMoisApres = new Date();
      troisMoisApres.setMonth(dateSysteme.getMonth() + 3);
  //    console.log(troisMoisApres)
  
      if (dateFinProc > troisMoisApres) {
        return 'Qualifié';
      }else if(dateFinProc < dateSysteme){
        return 'Non Qualifié';
      }
       else {
        return 'A Requalifié';
      }
    }

   
    //Ajout des Procede 
    createProcede()
    {
        this.route.navigate(["/pages/AddProcede"])
    }

    //Supprimer des Procede 
    OnDeleteConfirm(event) {
    this.procede= event.data;
    Swal.fire({

      title: 'Attention !',

      text: "Etes vous sûr de vouloir supprimer cette Procédé Spéciale ?",

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#3085d6',

      cancelButtonColor: '#d33',

      confirmButtonText: 'Oui, supprimer!'

    }).then((result) => {

      if (result.isConfirmed) {

        this.procede.etatactive = false;
        event.actif=false;
        this.service.updateProcede( this.procede.id,this.procede).subscribe(data => {
          this.toastrService.success("Suppression avec succés", "Succés", {
            duration: 5000,
              });

          this.LoadProcedes();
           },
            error => {
            this.toastrService.danger("Merci de contacter le service IT", 'Erreur');
          });

      }

    })

  }

  //Modifier des Procede 
  modifierProcede(event){
    this.procede= event.data;
   // console.log(this.procede.id)
    this.route.navigate(["/pages/EditProcede/"+this.procede.id])
    }
  }
  



