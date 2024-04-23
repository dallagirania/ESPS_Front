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
import Swal from 'sweetalert2';
import { Utilisateur } from '../../../Model/Utilisateur.model';
@Component({
  selector: 'ngx-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements   OnInit {
  idU: any;
  currentUser=new Utilisateur()


   constructor(
     private service: CrudService,
     private router: Router,
     private fb: FormBuilder,
     private toastrService: NbToastrService,
     private rout:ActivatedRoute)
      { 

     }
  ngOnInit(): void {
    this.idU=this.rout.snapshot.params["id"];
     this.service.getUserById(this.idU).subscribe(utilisateur=>{
      this.currentUser=utilisateur
      console.log(this.currentUser)
  })
  
  }
}
