import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { ModProcede } from '../../../Model/ModProcede.model';
import { CrudService } from '../../../Service/crud.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'ngx-download-files',
  templateUrl: './download-files.component.html',
  styleUrls: ['./download-files.component.scss']
})
export class DownloadFilesComponent implements  OnInit , ViewCell {
  renderValue: string;

  @Input() value: string;

  @Input() rowData: any;
   id:any
   modif:ModProcede=new ModProcede()
  constructor(
    private service: CrudService,
  ) { }

  ngOnInit(): void {
    this.renderValue = this.value;
    console.log("====> " + this.value );
  }
  download(){
    this.service.getModProcedeById(parseInt(this.value)).subscribe(mod => {
     this.modif=mod
     console.log(this.modif.files)
     for(let file of this.modif.files )
     {
      if(file.nom.endsWith('.pdf') || file.nom.endsWith('.doc')){
        this.service.downloadFile(file.nom).subscribe(res => {
          saveAs(res, "Procede_Spéciale" +file.nom);
        });
      }
      
     }
    }); 
  }
}
