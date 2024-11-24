import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { TopAncientRatingSystemPlayersComponent } from '@entities/charts/components/top-ancient-rating-system-players/top-ancient-rating-system-players.component';
import { TopTotalPointsPlayersComponent } from '@entities/charts/components/top-total-points-players/top-total-points-players.component';
import { AuthService } from '../../shared/services/auth.service';
import { PageComponent } from '@shared/ui/core/page/page.component';

@Component({
  selector: 'sfl-home',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    TopTotalPointsPlayersComponent,
    TopAncientRatingSystemPlayersComponent,
    PageComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [AuthService],
})
export class HomeComponent {
  private authService = inject(AuthService);
}
