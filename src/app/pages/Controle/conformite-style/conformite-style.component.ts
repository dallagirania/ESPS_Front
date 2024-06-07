import { Component, Input, OnInit } from '@angular/core';
import { CrudService } from '../../../Service/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-conformite-style',
  templateUrl: './conformite-style.component.html',
  styleUrls: ['./conformite-style.component.scss']
})
export class ConformiteStyleComponent  implements OnInit {

  @Input() value: boolean;
  resultat:string
  constructor(  private service:CrudService,
    private router: Router,
     private fb: FormBuilder,
     private dialogservice: NbDialogService,
     private toastrService: NbToastrService,
     private rout:ActivatedRoute
  ) { }

  ngOnInit(): void {
}

}
