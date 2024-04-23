import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametageRUOComponent } from './parametage-ruo.component';

describe('ParametageRUOComponent', () => {
  let component: ParametageRUOComponent;
  let fixture: ComponentFixture<ParametageRUOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametageRUOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametageRUOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
