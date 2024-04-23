import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueProcedeComponent } from './historique-procede.component';

describe('HistoriqueProcedeComponent', () => {
  let component: HistoriqueProcedeComponent;
  let fixture: ComponentFixture<HistoriqueProcedeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueProcedeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueProcedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
