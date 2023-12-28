import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewMatchWidgetComponent } from '@widgets';

@Component({
  standalone: true,
  selector: 'app-new-match',
  imports: [CommonModule, NewMatchWidgetComponent],
  templateUrl: './new-match.component.html',
  styleUrls: ['./new-match.component.css'],
  providers: [],
})
export class NewMatchComponent {}
