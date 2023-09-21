import { Routes } from '@angular/router';
import { HomeComponent } from 'src/pages/home/home.component';

export const routes: Routes = [
  { path: '', title: 'Home', component: HomeComponent },
  { path: 'home', title: 'Home', component: HomeComponent },
  {
    path: 'new-match',
    title: 'New Match',
    loadComponent: () =>
      import('../pages/new-match/new-match.component').then(
        (m) => m.NewMatchComponent
      ),
  },
];
