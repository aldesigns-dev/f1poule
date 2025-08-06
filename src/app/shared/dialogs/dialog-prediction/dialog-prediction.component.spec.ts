import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPredictionComponent } from './dialog-prediction.component';

describe('DialogPredictionComponent', () => {
  let component: DialogPredictionComponent;
  let fixture: ComponentFixture<DialogPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPredictionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
