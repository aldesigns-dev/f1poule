import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from "./layout/header/header.component";
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'f1poule';

  db = inject(Firestore);

  constructor() {
    console.log('Firestore is injected:', this.db);
  }
}
