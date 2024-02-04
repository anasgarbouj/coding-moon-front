import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderDialogComponent } from './leader-dialog.component';

describe('LeaderDialogComponent', () => {
  let component: LeaderDialogComponent;
  let fixture: ComponentFixture<LeaderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaderDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
