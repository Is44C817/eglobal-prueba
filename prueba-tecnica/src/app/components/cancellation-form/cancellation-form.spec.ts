import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationForm } from './cancellation-form';

describe('CancellationForm', () => {
  let component: CancellationForm;
  let fixture: ComponentFixture<CancellationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancellationForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancellationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
