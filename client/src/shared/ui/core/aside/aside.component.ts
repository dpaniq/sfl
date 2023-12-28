import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

import { LINKS } from './constants';

@Component({
  selector: 'sfl-aside',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
  ],
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AsideComponent {
  links = LINKS;
}
