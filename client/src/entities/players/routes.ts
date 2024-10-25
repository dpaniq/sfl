import { Routes } from '@angular/router';

export const PLAYERS_ROUTES: Routes = [
  {
    path: 'players',
    title: 'Players',
    children: [
      {
        path: '',
        title: 'Players',
        loadComponent: () =>
          import('./pages/players-main-page.component').then(
            c => c.PlayersMainPageComponent,
          ),
      },
      {
        path: ':id',
        title: 'Player details',
        loadComponent: () =>
          import('./pages/player-details-page.component').then(
            c => c.PlayerDetailsPageComponent,
          ),
        // TODO Resolver here
      },
    ],
  },
];
