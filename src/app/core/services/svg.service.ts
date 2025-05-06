import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SvgService {
  private httpClient = inject(HttpClient);

  getTrackSvg(trackName: string): Observable<string> {
    const url = `assets/tracks/track-${trackName.toLowerCase()}.svg`;
    return this.httpClient.get(url, { responseType: 'text' }).
    pipe(
      map((res: string) => res)
    );
  }
}