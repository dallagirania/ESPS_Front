import { Injectable } from '@angular/core';
import { of as observableOf,  Observable } from 'rxjs';
import { ProfitBarAnimationChartData } from '../data/profit-bar-animation-chart';

@Injectable()
export class ProfitBarAnimationChartService extends ProfitBarAnimationChartData {

  private data: any;

  constructor() {
    super();
    this.data = {
      firstLine: this.getDataForFirstLine(),
      secondLine: this.getDataForSecondLine(),
   //   thiredLine: this.getDataForThiredLine(),

    };
  }
  // getDataForFirstLine(): number[] {
  //   return this.createEmptyArray(100)
  //     .map((_, index) => {
  //       return 2 ;
  //     });
  // }
  
  // getDataForSecondLine(): number[] {
  //   return [2, 1, 5, 9, 6, 7, 1, 2, 3, 6, 6, 6, 9, 7, 8, 9, 10];
  // }
  // getDataForThiredLine(): number[] {
  //   return this.createEmptyArray(100)
  //     .map((_, index) => {
  //       return 5 ;
  //     });
  // }
  
  getDataForFirstLine(): number[] {
    return this.createEmptyArray(100)
      .map((_, index) => {
        const oneFifth = index / 5;

        return (Math.sin(oneFifth) * (oneFifth - 10) + index / 6) * 5;
      });
  }

  getDataForSecondLine(): number[] {
    return this.createEmptyArray(100)
      .map((_, index) => {
        const oneFifth = index / 5;

        return (Math.cos(oneFifth) * (oneFifth - 10) + index / 6) * 5;
      });
  }

  createEmptyArray(nPoints: number) {
    return Array.from(Array(nPoints));
  }

  getChartData(): Observable<{ firstLine: number[]; secondLine: number[]; }> {
    return observableOf(this.data);
  }
}
