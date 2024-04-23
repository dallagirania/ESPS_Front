import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedeOKDComponent } from './procede-okd.component';

describe('ProcedeOKDComponent', () => {
  let component: ProcedeOKDComponent;
  let fixture: ComponentFixture<ProcedeOKDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcedeOKDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedeOKDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
