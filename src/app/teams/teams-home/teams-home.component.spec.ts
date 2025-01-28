import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsHomeComponent } from './teams-home.component';

describe('TeamsHomeComponent', () => {
  let component: TeamsHomeComponent;
  let fixture: ComponentFixture<TeamsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamsHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
