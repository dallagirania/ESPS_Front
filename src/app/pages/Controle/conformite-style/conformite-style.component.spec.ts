import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformiteStyleComponent } from './conformite-style.component';

describe('ConformiteStyleComponent', () => {
  let component: ConformiteStyleComponent;
  let fixture: ComponentFixture<ConformiteStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConformiteStyleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConformiteStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
