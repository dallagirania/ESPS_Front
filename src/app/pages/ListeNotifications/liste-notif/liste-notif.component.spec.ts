import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeNotifComponent } from './liste-notif.component';

describe('ListeNotifComponent', () => {
  let component: ListeNotifComponent;
  let fixture: ComponentFixture<ListeNotifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeNotifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
