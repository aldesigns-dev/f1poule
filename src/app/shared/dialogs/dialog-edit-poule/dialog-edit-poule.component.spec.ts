import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditPouleComponent } from './dialog-edit-poule.component';

describe('DialogEditPouleComponent', () => {
  let component: DialogEditPouleComponent;
  let fixture: ComponentFixture<DialogEditPouleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditPouleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditPouleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
