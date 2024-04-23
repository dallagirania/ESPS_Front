import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-profit-card',
  styleUrls: ['./profit-card.component.scss'],
  templateUrl: './profit-card.component.html',
})
export class ProfitCardComponent implements OnInit {
  @Input() mesureData: any;
  flipped = false;


  ngOnInit(): void {
    console.log("parm passé en argument du catre profile ", this.mesureData)
   
  }
 
  toggleView() {
    this.flipped = !this.flipped;
  }
 
}
