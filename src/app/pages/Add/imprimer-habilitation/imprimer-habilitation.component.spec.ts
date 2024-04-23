import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimerHabilitationComponent } from './imprimer-habilitation.component';

describe('ImprimerHabilitationComponent', () => {
  let component: ImprimerHabilitationComponent;
  let fixture: ComponentFixture<ImprimerHabilitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprimerHabilitationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprimerHabilitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
