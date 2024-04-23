import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedeComponent } from './procede.component';

describe('ProcedeComponent', () => {
  let component: ProcedeComponent;
  let fixture: ComponentFixture<ProcedeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcedeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
