import { Component, OnInit } from '@angular/core';
import { NbCalendarRange, NbDateService } from '@nebular/theme';
import { DayCellComponent } from '../../extra-components/calendar/day-cell/day-cell.component';

@Component({
  selector: 'ngx-calendrier',
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.scss']
})
export class CalendrierComponent implements OnInit {
  currentDate: Date;
  nextMonth: Date;
  secondNextMonth: Date;
  ThirdNextMonth:Date;

  constructor(protected dateService: NbDateService<Date>) {
  }

  ngOnInit(): void {
    const currentDate = new Date(); // Initialize current date only once
    this.nextMonth = this.dateService.addMonth(new Date(currentDate), 1);
    this.secondNextMonth = this.dateService.addMonth(new Date(currentDate), 2);
    this.ThirdNextMonth = this.dateService.addMonth(new Date(currentDate), 3);
  }
}