import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawSettingsComponent } from './draw-settings.component';

describe('DrawSettingsComponent', () => {
  let component: DrawSettingsComponent;
  let fixture: ComponentFixture<DrawSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
