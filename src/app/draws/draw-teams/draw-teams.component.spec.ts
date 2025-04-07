import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawTeamsComponent } from './draw-teams.component';

describe('DrawTeamsComponent', () => {
  let component: DrawTeamsComponent;
  let fixture: ComponentFixture<DrawTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawTeamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
