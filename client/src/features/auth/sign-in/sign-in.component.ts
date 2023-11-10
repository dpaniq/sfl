import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NEVER, catchError, delay } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'sfl-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressBarModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  constructor(private httpClient: HttpClient, private router: Router) {}

  loading = signal(false);

  signInFG = new FormGroup({
    email: new FormControl<string>('YE0x1@sfl.lv', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.min(5), Validators.required],
    }),
  });

  get emailFG() {
    return this.signInFG.controls.email;
  }

  get passwordFG() {
    return this.signInFG.controls.password;
  }

  onSubmit() {
    this.loading.set(true);
    // TODO: Use EventEmitter with form value
    console.warn(this.signInFG.getRawValue());
    const payload = this.signInFG.getRawValue();

    this.httpClient
      .post('http://localhost:3001/auth/login', payload)
      .pipe(
        delay(1500),
        catchError((err) => {
          console.warn(err);
          this.signInFG.reset({ email: '', password: '' });
          this.loading.set(false);
          return NEVER;
        })
      )
      .subscribe((response) => {
        if (response) {
          console.log(response);
          this.loading.set(false);
          this.router.navigate(['/']);
        }
      });
  }
}
