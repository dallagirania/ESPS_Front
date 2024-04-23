import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedeDetailComponent } from './procede-detail.component';

describe('ProcedeDetailComponent', () => {
  let component: ProcedeDetailComponent;
  let fixture: ComponentFixture<ProcedeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcedeDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
