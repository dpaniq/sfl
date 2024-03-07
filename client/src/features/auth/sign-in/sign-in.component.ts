import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NEVER, catchError, delay } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpService } from '../../../shared/services/http.service';
import { AuthService } from '@shared/services/auth.service';

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
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  private readonly authService = inject(AuthService);

  constructor(private router: Router) {}

  loading = signal(false);

  signInFG = new FormGroup({
    email: new FormControl<string>('admin@admin.lv', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl<string>('password', {
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
    const payload = this.signInFG.getRawValue();

    this.authService
      .signIn(payload)

      .subscribe(response => {
        console.log(response);
        if (response) {
          this.router.navigate(['/']);
        }
        this.loading.set(false);
      });
  }
}
