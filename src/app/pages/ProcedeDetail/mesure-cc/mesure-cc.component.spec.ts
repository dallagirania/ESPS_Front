import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesureCCComponent } from './mesure-cc.component';

describe('MesureCCComponent', () => {
  let component: MesureCCComponent;
  let fixture: ComponentFixture<MesureCCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesureCCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MesureCCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
