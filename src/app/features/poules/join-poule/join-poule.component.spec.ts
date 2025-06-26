import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinPouleComponent } from './join-poule.component';

describe('JoinPouleComponent', () => {
  let component: JoinPouleComponent;
  let fixture: ComponentFixture<JoinPouleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinPouleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinPouleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
