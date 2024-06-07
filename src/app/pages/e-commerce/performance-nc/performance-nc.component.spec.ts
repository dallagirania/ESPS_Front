import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceNCComponent } from './performance-nc.component';

describe('PerformanceNCComponent', () => {
  let component: PerformanceNCComponent;
  let fixture: ComponentFixture<PerformanceNCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceNCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceNCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
