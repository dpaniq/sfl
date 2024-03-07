import { Injectable, inject, signal } from '@angular/core';
import { HttpService } from './http.service';
import { delay, tap } from 'rxjs';

interface User {
  _id: string;
  email: string;
  roles: string[];
  accessToken?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpService = inject(HttpService);

  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  setUser(user: User | null) {
    this._user.set(user);
  }

  constructor() {
    this.whoAmI();
  }

  whoAmI() {
    this.httpService.get<User>('auth/whoami').subscribe(response => {
      if (response) {
        this.setUser({
          _id: response._id,
          email: response.email,
          roles: response.roles,
        });
      }
    });
  }

  signIn(payload: { email: string; password: string }) {
    return this.httpService.post<User>('auth/sign-in', payload).pipe(
      delay(1500),
      tap(response => {
        const accessToken = response?.accessToken;

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          this.whoAmI();
        }
      }),
    );
  }

  signOut() {
    return this.httpService.post<User>('auth/sign-out').pipe(
      tap(() => {
        this.setUser(null);
        localStorage.removeItem('accessToken');
      }),
    );
  }
}
