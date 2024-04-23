import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametageSiteComponent } from './parametage-site.component';

describe('ParametageSiteComponent', () => {
  let component: ParametageSiteComponent;
  let fixture: ComponentFixture<ParametageSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametageSiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametageSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
