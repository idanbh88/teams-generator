import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawsHomeComponent } from './draws-home.component';

describe('DrawsHomeComponent', () => {
  let component: DrawsHomeComponent;
  let fixture: ComponentFixture<DrawsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawsHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
