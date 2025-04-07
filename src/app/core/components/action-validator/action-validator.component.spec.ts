import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionValidatorComponent } from './action-validator.component';

describe('ActionValidatorComponent', () => {
  let component: ActionValidatorComponent;
  let fixture: ComponentFixture<ActionValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionValidatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
