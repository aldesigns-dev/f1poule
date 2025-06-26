import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';

import { HideOnErrorDirective } from '../../directives/hide-on-error.directive';

@Component({
  selector: 'app-dialog-avatar',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatDivider, HideOnErrorDirective],
  templateUrl: './dialog-avatar.component.html',
  styleUrl: './dialog-avatar.component.scss'
})
export class DialogAvatarComponent {
  private dialogRef = inject(MatDialogRef<DialogAvatarComponent>);

  avatars = [
    'avatar1.png',
    'avatar2.png',
    'avatar3.png',
    'avatar4.png',
    'avatar5.png',
    'avatar6.png'
  ];

  selectAvatar(avatar: string) {
    this.dialogRef.close(avatar);
  }
}
