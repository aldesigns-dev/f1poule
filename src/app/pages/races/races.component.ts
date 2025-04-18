import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { JolpicaF1Service } from '../../core/services/jolpica-f1.service';

@Component({
  selector: 'app-races',
  standalone: true,
  imports: [],
  templateUrl: './races.component.html',
  styleUrl: './races.component.scss'
})
export class RacesComponent implements OnInit {
  private readonly jolpicaF1Service = inject(JolpicaF1Service);
  private readonly destroyRef = inject(DestroyRef);
  readonly pageTitle = input<string>();

  races: any[] = [];
  season = '2025';

  ngOnInit(): void {
    this.jolpicaF1Service.getRaces(this.season)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((res) => {
      const races = res?.MRData?.RaceTable?.Races || [];
        this.races = races;
    });
  }
}
