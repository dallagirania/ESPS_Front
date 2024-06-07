import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Utilisateur } from '../../../Model/Utilisateur.model';
import { CrudService } from '../../../Service/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { MesureOKD } from '../../../Model/MesureOKD.model';
import { Critere } from '../../../Model/Critere.model';

import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'ngx-operateur-render',
  templateUrl: './operateur-render.component.html',
  styleUrls: ['./operateur-render.component.scss']
})
export class OperateurRenderComponent implements OnInit {
  @Input() value: string;
  mesure= new MesureOKD()
  mesureDetails: { critere: string; valeur: string }[] = [];
  critere= new Critere()
  constructor(  private service:CrudService,
    private router: Router,
     private fb: FormBuilder,
     private dialogservice: NbDialogService,
     private toastrService: NbToastrService,
     private rout:ActivatedRoute
  ) { }

  ngOnInit(): void {
     this.service.getMesureOKDDetailById(parseInt(this.value)).subscribe(mesure=>{
       this.mesure=mesure
       this.extractMesureDetails()
     })
   
}
detail(dialog: TemplateRef<any>) {
  this.dialogservice.open(dialog);
}



extractMesureDetails() {
  if (this.mesure && this.mesure.val) {
    const critereObservables = [];
    for (const [critereId, valeur] of Object.entries(this.mesure.val)) {
      const critereObservable = this.findCritereName(parseInt(critereId)).pipe(
        map(nomCritere => {
          return { critere: nomCritere, valeur: valeur };
        })
      );
      critereObservables.push(critereObservable);
    }
    forkJoin(critereObservables).subscribe((result: any) => {
      this.mesureDetails = result;
    });
  }
}

findCritereName(critereId: number) {
  return this.service.getCritere().pipe(
    map(criteres => {
      const critere = criteres.find(critere => critere.id === critereId);
      if (critere) {
        if (critere.type === 'valeur') {
          return `${critere.nom} : entre[${critere.min} , ${critere.max}]`;
        } else {
          return `${critere.nom} (Ok/Nok) `;
        }
      } else {
        return undefined;
      }
    })
  );
}


}



