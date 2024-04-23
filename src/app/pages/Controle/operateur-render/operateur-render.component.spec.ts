import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperateurRenderComponent } from './operateur-render.component';

describe('OperateurRenderComponent', () => {
  let component: OperateurRenderComponent;
  let fixture: ComponentFixture<OperateurRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperateurRenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperateurRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
