import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProcedeComponent } from './add-procede.component';

describe('AddProcedeComponent', () => {
  let component: AddProcedeComponent;
  let fixture: ComponentFixture<AddProcedeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProcedeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProcedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
