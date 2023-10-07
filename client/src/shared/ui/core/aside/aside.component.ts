import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { LINKS } from './constants';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css'],
})
export class AsideComponent {
  links = LINKS;
}
