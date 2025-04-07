import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditDrawComponent } from './create-or-edit-draw.component';

describe('CreateOrEditDrawComponent', () => {
  let component: CreateOrEditDrawComponent;
  let fixture: ComponentFixture<CreateOrEditDrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrEditDrawComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrEditDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
