import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { RacesComponent } from './pages/races/races.component';
import { DriverDetailComponent } from './pages/drivers/driver-details/driver-details.component';
import { DriversComponent } from './pages/drivers/drivers.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'teams',
    component: TeamsComponent,
    data: {
      pageTitle: 'F1 Teams 2025'
    }
  },
  {
    path: 'coureurs',
    component: DriversComponent,
    data: {
      pageTitle: 'F1 Coureurs 2025'
    }
  },
  {
    path: 'races',
    component: RacesComponent,
    data: {
      pageTitle: 'F1 Races 2025'
    }
  },
  {
    path: 'drivers/:slug',
    component: DriverDetailComponent,
  }
];
