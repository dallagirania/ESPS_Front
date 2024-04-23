import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PontComponent } from './pont.component';

describe('PontComponent', () => {
  let component: PontComponent;
  let fixture: ComponentFixture<PontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PontComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
