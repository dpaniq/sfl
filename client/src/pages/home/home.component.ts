import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { TotalPointsByPlayerChartComponent } from '@entities/players/components/charts/total-points-by-player-chart/total-points-by-player-chart.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'sfl-home',
  standalone: true,
  imports: [CommonModule, MatDividerModule, TotalPointsByPlayerChartComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [AuthService],
})
export class HomeComponent {
  private authService = inject(AuthService);
}
