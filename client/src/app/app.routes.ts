import { Routes } from '@angular/router';
import { HomeComponent } from 'src/pages/home/home.component';

export const routes: Routes = [
  { path: '', title: 'Home', component: HomeComponent },
  { path: 'home', title: 'Home', component: HomeComponent },
  {
    path: 'sign-in',
    title: 'Sign In',
    loadComponent: () =>
      import('../pages/sign-in-page/sign-in-page.component').then(
        m => m.SignInPageComponent,
      ),
  },
  {
    path: 'new-match',
    title: 'New Match',
    loadComponent: () =>
      import('../pages/new-match/new-match.component').then(
        m => m.NewMatchComponent,
      ),
  },
  {
    path: 'captains',
    title: 'Captains',
    loadComponent: () =>
      import('../pages/captains-page/captains-page.component').then(
        m => m.CaptainsPageComponent,
      ),
  },
  {
    path: 'players',
    title: 'Players',
    loadComponent: () =>
      import('../pages/players-page/players-page.component').then(
        m => m.PlayersPageComponent,
      ),
  },
  {
    path: 'games',
    title: 'Games',
    loadComponent: () =>
      import('../pages/games-page/games-page.component').then(
        m => m.GamesPageComponent,
      ),
    // children: [
    //   {
    //     path: ':id'
    //   }
    // ]
  },
];
