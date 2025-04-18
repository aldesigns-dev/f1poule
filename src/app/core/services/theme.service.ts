import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Signal die het huidige thema (light/dark) bijhoudt.
  private theme = signal<'light-theme' | 'dark-theme'>('light-theme');

  // Readonly property die verwijst naar de signal.
  getTheme = this.theme;

  // Thema ophalen uit localStorage, fallback naar 'light-theme'.
  constructor() {
    const savedTheme = (localStorage.getItem('theme') as 'light-theme' | 'dark-theme') ?? 'light-theme';
    this.setTheme(savedTheme);
  }

  // Stel het thema in, werk signal bij, keuze opslaan in localStorage en pas de class toe op de <body>.
  setTheme(value: 'light-theme' | 'dark-theme') { 
    this.theme.set(value);
    localStorage.setItem('theme', value); 
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(value);
  }
}