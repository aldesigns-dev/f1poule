import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoulesComponent } from './poules.component';

describe('PoulesComponent', () => {
  let component: PoulesComponent;
  let fixture: ComponentFixture<PoulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
