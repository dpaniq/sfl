import { Routes } from '@angular/router';
import { HomeComponent } from 'src/pages/home/home.component';
import { GAMES_ROUTES } from '@entities/games';

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
  {
    path: 'players',
    title: 'Players',
    loadComponent: () =>
      import('../pages/players-page/players-page.component').then(
        c => c.PlayersPageComponent,
      ),
  },
  ...GAMES_ROUTES,
];
