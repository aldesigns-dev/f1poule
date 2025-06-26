import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAvatarComponent } from './dialog-avatar.component';

describe('DialogAvatarComponent', () => {
  let component: DialogAvatarComponent;
  let fixture: ComponentFixture<DialogAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAvatarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
