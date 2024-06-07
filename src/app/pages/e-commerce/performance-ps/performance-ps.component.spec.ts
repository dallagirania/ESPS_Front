import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformancePSComponent } from './performance-ps.component';

describe('PerformancePSComponent', () => {
  let component: PerformancePSComponent;
  let fixture: ComponentFixture<PerformancePSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformancePSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformancePSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
