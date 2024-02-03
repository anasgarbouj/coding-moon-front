import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodingMoonFormComponent } from './coding-moon-form.component';

describe('CodingMoonFormComponent', () => {
  let component: CodingMoonFormComponent;
  let fixture: ComponentFixture<CodingMoonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodingMoonFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodingMoonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
