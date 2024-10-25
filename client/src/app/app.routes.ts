import { Routes } from '@angular/router';
import { GAMES_ROUTES } from '@entities/games';
import { PLAYERS_ROUTES } from '@entities/players';
import { HomeComponent } from 'src/pages/home/home.component';

export const routes: Routes = [
  { path: '', title: 'Home', component: HomeComponent },
  { path: 'home', title: 'Home', component: HomeComponent },
  {
    path: 'sign-in',
    title: 'Sign In',
    loadComponent: () =>
      import('../pages/sign-in-page/sign-in-page.component').then(
        c => c.SignInPageComponent,
      ),
  },
  {
    path: 'new-match',
    title: 'New Match',
    loadComponent: () =>
      import('../pages/new-match/new-match.component').then(
        c => c.NewMatchComponent,
      ),
  },
  {
    path: 'captains',
    title: 'Captains',
    loadComponent: () =>
      import('../pages/captains-page/captains-page.component').then(
        c => c.CaptainsPageComponent,
      ),
  },
  ...PLAYERS_ROUTES,
  ...GAMES_ROUTES,
];
