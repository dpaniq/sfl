import { Routes } from '@angular/router';
import { HomeComponent } from 'src/pages/home/home.component';
import { GamePageDetailsComponent } from '../pages/game-page-details/game-page-details.component';

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
  {
    path: 'games',
    title: 'Games',
    // loadComponent: () =>
    //   import('../pages/games-page/games-page.component').then(
    //     c => c.GamesPageComponent,
    //   ),
    children: [
      {
        path: '',
        title: 'Games',
        loadComponent: () =>
          import('../pages/games-page/games-page.component').then(
            c => c.GamesPageComponent,
          ),
      },
      {
        path: ':season/:id',
        title: 'Game details',
        loadComponent: () =>
          import('../pages/game-page-details/game-page-details.component').then(
            c => c.GamePageDetailsComponent,
          ),
        // TODO Resolver here
      },
    ],
  },
];
