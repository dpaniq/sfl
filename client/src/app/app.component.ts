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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NEVER, catchError, delay } from 'rxjs';

@Component({
  selector: 'app-root',
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
    HttpClientModule,
    RouterModule,
  ],
  providers: [
    CookieService,
    JwtService,
    LocalStorageService,
    HttpClientModule,
    RouterModule,
  ],
})
export class AppComponent {
  #cookieService = inject(CookieService);
  #jwtService = inject(JwtService);
  #httpClient = inject(HttpClient);
  #router = inject(Router);

  onLogout() {
    var headersx = new Headers();
    headersx.append('Content-Type', 'application/json');
    headersx.append('Accept', 'application/json');

    this.#httpClient
      .get('https://sfl.com:3001/auth/logout', {
        withCredentials: true,
        headers: {
          ...(headersx as any),
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .pipe(
        delay(1500),
        catchError((err) => {
          return NEVER;
        })
      )
      .subscribe((response) => {
        if (response) {
          console.log(response);
          // this.#router.navigate(['/sign-in']);
        }
      });
  }
}
