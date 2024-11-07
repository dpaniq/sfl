import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { Top10AncientRatingSystemBySeasonComponent } from '@entities/players/components/charts/top-10-ancient-rating-system-by-season/top-10-ancient-rating-system-by-season.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'sfl-home',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    Top10AncientRatingSystemBySeasonComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [AuthService],
})
export class HomeComponent {
  private authService = inject(AuthService);
}
