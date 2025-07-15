import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PouleDetailsComponent } from './poule-details.component';

describe('PouleDetailsComponent', () => {
  let component: PouleDetailsComponent;
  let fixture: ComponentFixture<PouleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PouleDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PouleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
