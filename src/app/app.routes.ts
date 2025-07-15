import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { redirectIfLoggedIn } from './core/guards/auth-redirect.guard';

import { HomeComponent } from './pages/home/home.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { RacesComponent } from './pages/races/races.component';
import { DriverDetailsComponent } from './pages/drivers/driver-details/driver-details.component';
import { DriversComponent } from './pages/drivers/drivers.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { PoulesComponent } from './features/poules/poules.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { JoinPouleComponent } from './features/poules/join-poule/join-poule.component';
import { PouleDetailsComponent } from './features/poules/poule-details/poule-details.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      pageTitle: 'F1 Poule'
    }
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
    component: DriverDetailsComponent,
  },
  {
    path: 'login',
    canActivate: [redirectIfLoggedIn],
    component: LoginComponent,
    data: {
      pageTitle: 'Login'
    }
  },
  {
    path: 'register',
    canActivate: [redirectIfLoggedIn],
    component: RegisterComponent,
    data: {
      pageTitle: 'Aanmelden'
    }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      pageTitle: 'Dashboard'
    }
  },
  {
    path: 'poules',
    canActivate: [authGuard],
    component: PoulesComponent,
  },
  {
    path: 'poules/:id',
    canActivate: [authGuard],
    component: PouleDetailsComponent,
  },
  {
    path: 'poules/join/:inviteCode',
    component: JoinPouleComponent, 
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];
