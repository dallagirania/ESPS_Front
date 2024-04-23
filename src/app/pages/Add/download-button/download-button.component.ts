import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { CrudService } from '../../../Service/crud.service';
import { Router } from '@angular/router';
import { ModFormation } from '../../../Model/ModFormation.model';
 import { saveAs } from 'file-saver';
@Component({
  selector: 'ngx-download-button',
  templateUrl: './download-button.component.html',
  styleUrls: ['./download-button.component.scss'],
})

export class DownloadButtonComponent implements OnInit , ViewCell {
  renderValue: string;

  @Input() value: string;

  @Input() rowData: any;
   id:any
   modif:ModFormation=new ModFormation()
  constructor(
    private service: CrudService,
  ) { }

  ngOnInit(): void {
    this.renderValue = this.value;
    console.log("====> " + this.value );
  }
 /* download(){
    this.service.getModFormationById(parseInt(this.value)).subscribe(mod => {
     this.modif=mod
     console.log(this.modif.files)
     for(let file of this.modif.files )
     {
      this.service.downloadFile(file.nom).subscribe(res => {

        saveAs(res, "habilitation" +file.nom);
  
      });
     }

    }); 
  }*/
  download(){
    this.service.getModFormationById(parseInt(this.value)).subscribe(
      mod => {
        this.modif = mod;
        console.log(this.modif.files);
        for(let file of this.modif.files) {
          this.service.downloadFile(file.nom).subscribe(
            res => {
              saveAs(res, "habilitation" + file.nom);
            },
            error => {
              console.error("Erreur lors du téléchargement du fichier:", error);
            }
          );
        }
      },
      error => {
        console.error("Erreur lors de la récupération de la modifFormation:", error);
        
        // Si une erreur est détectée, récupérez les fichiers de la formation correspondante
        this.service.getFormationById(2).subscribe(
          formation => {
            console.log("le fichier du formation : ",formation.files)
            for(let file of formation.files) {
              this.service.downloadFile(file.nom).subscribe(
                res => {
                  saveAs(res, "habilitation" + file.nom);
                },
                err => {
                  console.error("Erreur lors du téléchargement du fichier de formation:", err);
                }
              );
            }
          },
          err => {
            console.error("Erreur lors de la récupération de la formation:", err);
          }
        );
      }
    ); 
  }
  
}
