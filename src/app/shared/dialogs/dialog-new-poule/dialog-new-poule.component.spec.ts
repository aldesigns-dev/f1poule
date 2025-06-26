import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewPouleComponent } from './dialog-new-poule.component';

describe('DialogNewPouleComponent', () => {
  let component: DialogNewPouleComponent;
  let fixture: ComponentFixture<DialogNewPouleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogNewPouleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogNewPouleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
