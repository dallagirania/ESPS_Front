import { Component, Input, OnInit } from '@angular/core';
import { Utilisateur } from '../../../Model/Utilisateur.model';
import { CrudService } from '../../../Service/crud.service';

@Component({
  selector: 'ngx-operateur-render',
  templateUrl: './operateur-render.component.html',
  styleUrls: ['./operateur-render.component.scss']
})
export class OperateurRenderComponent implements OnInit {
  @Input() value: string;
  utilisateur =new Utilisateur()
  constructor(  private service:CrudService,) { }

  ngOnInit(): void {
     console.log(this.value)
    this.service.getUserById(parseInt(this.value)).subscribe(user=>{
      this.utilisateur=user 
      console.log(this.utilisateur)
      
     })
 
}
  

}
