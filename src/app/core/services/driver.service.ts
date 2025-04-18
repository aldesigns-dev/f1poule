import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private httpClient = inject(HttpClient)

  getDrivers(): Observable<Driver[]> {
    return this.httpClient
    .get<{ drivers: Driver[] }>('http://localhost:3000/api/drivers')
    .pipe(
      tap(response => {
        console.log('Response:', response)
      }),
      map(response => response.drivers),
    );
  }
}