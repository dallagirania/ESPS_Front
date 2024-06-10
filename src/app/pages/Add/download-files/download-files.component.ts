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
  // download(){
  //   this.service.getModProcedeById(parseInt(this.value)).subscribe(mod => {
  //    this.modif=mod
  //    console.log(this.modif.files)
  //    for(let file of this.modif.files )
  //    {
  //     if(file.nom.endsWith('.pdf') || file.nom.endsWith('.doc')|| file.nom.endsWith('.xlsx')){
  //       this.service.downloadFile(file.nom).subscribe(res => {
  //         saveAs(res, "Procede_Spéciale" +file.nom);
  //       });
  //     }
      
  //    }
  //   }); 
  // }
   
  download(){
    this.service.getModProcedeById(parseInt(this.value)).subscribe(mod => {
        this.modif = mod;
        console.log("le fichier du Procede_Spéciale premiere partie : ",this.modif.files);
        for(let file of this.modif.files) {
            if(file.nom.endsWith('.pdf') || file.nom.endsWith('.doc')|| file.nom.endsWith('.xlsx')){
              this.service.download(file.nom).subscribe(
                res => {
                  saveAs(res, "Procede"+file.nom);
                },
                error => {
                  console.error("Erreur lors du téléchargement du fichier:", error);
                }
              );
            }
        }
      },
      error => {    
        // Si une erreur est détectée, récupérez les fichiers de la formation correspondante
        this.service.getProcedeById(parseInt(this.value)).subscribe(
          ps => {
            console.log("le fichier du Procede_Spéciale deuxieme partie : ",ps.files)
            for(let file of ps.files) {
              if(file.nom.endsWith('.pdf') || file.nom.endsWith('.doc')|| file.nom.endsWith('.xlsx')){
                this.service.download(file.nom).subscribe(
                  res => {
                    saveAs(res,"Procede"+file.nom);
                  },
                  err => {
                    console.error("Erreur lors du téléchargement du fichier de Procede_Spéciale:", err);
                  }
                );
              }
            }
          },
          err => {
            console.error("Erreur lors de la récupération de la Procede_Spéciale:", err);
          }
        );
      }
    ); 
  }
}
