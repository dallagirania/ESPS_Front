import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { CrudService } from '../../../Service/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import html2pdf from 'html2pdf.js';
@Component({
  selector: 'ngx-imprimer-habilitation',
  templateUrl: './imprimer-habilitation.component.html',
  styleUrls: ['./imprimer-habilitation.component.scss']
})
export class ImprimerHabilitationComponent implements OnInit, ViewCell {

  
  renderValue: number;

  @Input() value: number;

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
     private dialogservice: NbDialogService,
     private toastrService: NbToastrService,
     private rout:ActivatedRoute
  ) { }

  ngOnInit(): void {
   this.renderValue = this.value;
   console.log("====> " + this.value );
    
 
  }

  // historique(dialog: TemplateRef<any>) {
  //   this.dialogservice.open(dialog);
  // }
   navigate(){
    this.router.navigate(["/pages/DetailProcede/"+this.value])
  }
}

