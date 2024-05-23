import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourbeCCComponent } from './courbe-cc.component';

describe('CourbeCCComponent', () => {
  let component: CourbeCCComponent;
  let fixture: ComponentFixture<CourbeCCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourbeCCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourbeCCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
