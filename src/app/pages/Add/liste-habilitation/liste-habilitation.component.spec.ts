import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeHabilitationComponent } from './liste-habilitation.component';

describe('ListeHabilitationComponent', () => {
  let component: ListeHabilitationComponent;
  let fixture: ComponentFixture<ListeHabilitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeHabilitationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeHabilitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
