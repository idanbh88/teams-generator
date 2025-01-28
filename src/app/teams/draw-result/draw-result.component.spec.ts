import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawResultComponent } from './draw-result.component';

describe('DrawResultComponent', () => {
  let component: DrawResultComponent;
  let fixture: ComponentFixture<DrawResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
