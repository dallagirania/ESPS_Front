import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeProcedeComponent } from './liste-procede.component';

describe('ListeProcedeComponent', () => {
  let component: ListeProcedeComponent;
  let fixture: ComponentFixture<ListeProcedeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeProcedeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeProcedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
