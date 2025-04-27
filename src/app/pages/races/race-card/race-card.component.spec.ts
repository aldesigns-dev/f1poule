import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceCardComponent } from './race-card.component';

describe('RaceCardComponent', () => {
  let component: RaceCardComponent;
  let fixture: ComponentFixture<RaceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
