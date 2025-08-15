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
import { SpeluitlegComponent } from './pages/speluitleg/speluitleg.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'F1 Poule',
    data: {
      pageTitle: 'F1 Poule'
    }
  },
  {
    path: 'teams',
    component: TeamsComponent,
    title: 'F1 Teams 2025',
    data: {
      pageTitle: 'F1 Teams 2025'
    }
  },
  {
    path: 'coureurs',
    component: DriversComponent,
    title: 'F1 Coureurs 2025',
    data: {
      pageTitle: 'F1 Coureurs 2025'
    }
  },
  {
    path: 'races',
    component: RacesComponent,
    title: 'F1 Races 2025',
    data: {
      pageTitle: 'F1 Races 2025'
    }
  },
  {
    path: 'drivers/:slug',
    component: DriverDetailsComponent,
    title: 'Coureur Details',
    data: {
      pageTitle: 'Coureur Details'
    }
  },
  {
    path: 'login',
    canActivate: [redirectIfLoggedIn],
    component: LoginComponent,
    title: 'Login',
    data: {
      pageTitle: 'Login'
    }
  },
  {
    path: 'register',
    canActivate: [redirectIfLoggedIn],
    component: RegisterComponent,
    title: 'Aanmelden',
    data: {
      pageTitle: 'Aanmelden'
    }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
    data: {
      pageTitle: 'Dashboard'
    }
  },
  {
    path: 'speluitleg',
    component: SpeluitlegComponent,
    title: 'Speluitleg',
    data: {
      pageTitle: 'Speluitleg'
    }
  },
  {
    path: 'poules',
    canActivate: [authGuard],
    component: PoulesComponent,
    title: 'Poules',
    data: {
      pageTitle: 'Poules'
    }
  },
  {
    path: 'poules/:id',
    canActivate: [authGuard],
    component: PouleDetailsComponent,
    title: 'Poule Details',
    data: {
      pageTitle: 'Poule Details'
    }
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
