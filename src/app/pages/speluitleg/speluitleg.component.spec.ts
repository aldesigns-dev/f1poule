import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeluitlegComponent } from './speluitleg.component';

describe('SpeluitlegComponent', () => {
  let component: SpeluitlegComponent;
  let fixture: ComponentFixture<SpeluitlegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeluitlegComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeluitlegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
