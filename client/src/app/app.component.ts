import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AsideComponent } from 'src/shared/ui/core/aside';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CookieService } from '@shared/services/cookie.service';
import { JwtService } from '@shared/services/jwt.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { HttpClient } from '@angular/common/http';
import { NEVER, catchError, delay } from 'rxjs';
import { HttpService } from '@shared/services/http.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'sfl-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    RouterOutlet,
    AsideComponent,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    RouterModule,
  ],
  providers: [
    HttpService,
    CookieService,
    JwtService,
    LocalStorageService,
    RouterModule,
  ],
})
export class AppComponent {
  #cookieService = inject(CookieService);
  #jwtService = inject(JwtService);
  #httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly authService = inject(AuthService);
  readonly userSignal = this.authService.user;

  onSignOut() {
    this.authService.signOut().subscribe(response => {
      if (response) {
        this.router.navigate(['/']);
      }
    });
  }
}
