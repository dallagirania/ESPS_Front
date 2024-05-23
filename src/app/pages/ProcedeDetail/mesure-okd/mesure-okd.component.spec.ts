import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesureOKDComponent } from './mesure-okd.component';

describe('MesureOKDComponent', () => {
  let component: MesureOKDComponent;
  let fixture: ComponentFixture<MesureOKDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesureOKDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MesureOKDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
