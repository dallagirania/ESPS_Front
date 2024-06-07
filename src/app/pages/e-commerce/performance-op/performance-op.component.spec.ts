import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceOpComponent } from './performance-op.component';

describe('PerformanceOpComponent', () => {
  let component: PerformanceOpComponent;
  let fixture: ComponentFixture<PerformanceOpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceOpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
