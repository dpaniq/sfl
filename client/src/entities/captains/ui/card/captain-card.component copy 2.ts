import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TCaptain } from '../../types';
import { CardVariantEnum } from '@shared/constants/card';

@Component({
  standalone: true,
  selector: 'sfl-captain-card',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, MatCardModule],
  styles: [
    `
      :host.odd {
        box-shadow: 2px 0 2px 2px #ccc;
      }

      .captain-card {
        & img {
          max-width: 100%;
        }
        transition: scale 1ms;
        transition-timing-function: ease;

        &.simple {
          &:hover {
            cursor: pointer;
          }
        }

        &.full {
          &:hover {
            cursor: url('/assets/cursor/person_remove.svg'), auto;
            background: tomato;
            color: white;
            scale: 1.01;
            z-index: 1;
            & img {
              filter: blur(1px) grayscale(100);
            }
          }
        }
      }
    `,
  ],
  template: `
    <ng-container [ngSwitch]="variant">
      <ng-container *ngSwitchCase="variantEnum.Stats"
        ><ng-container *ngTemplateOutlet="simple"></ng-container
      ></ng-container>

      <ng-container *ngSwitchCase="variantEnum.Preview"
        ><ng-container *ngTemplateOutlet="full"></ng-container
      ></ng-container>

      <ng-container *ngSwitchDefault>Default card</ng-container>
    </ng-container>

    <!-- Captain Card [Simple] -->
    <ng-template #simple>
      <mat-card class="captain-card">
        <mat-card-header>
          <mat-card-title-group>
            <mat-card-title
              >{{ captain.nickname }}
              <span *ngIf="captain?.team"
                >({{ captain.team }})</span
              ></mat-card-title
            >
            <mat-card-subtitle
              >{{ captain.name }} {{ captain.surname }}</mat-card-subtitle
            >
            <!-- <img
              mat-card-sm-image
              src="https://material.angular.io/assets/img/examples/shiba2.jpg"
            /> -->
          </mat-card-title-group>
        </mat-card-header>
        <mat-card-content>
          <p>Draws: {{ captain.draws }}</p>
          <p>Won Games:{{ captain.wonGames }}</p>
          <p>Lost Games: {{ captain.lostGames }}</p>
          <p>Max Win Streak: {{ captain.maxWinStreak }}</p>
          <p>Max Lost Strek: {{ captain.maxLostStreak }}</p>
        </mat-card-content>
      </mat-card>
    </ng-template>

    <!-- Captain Card [Full] -->
    <ng-template #full>
      <mat-card class="captain-card full">
        <mat-card-header>
          <div mat-card-avatar class="example-header-image"></div>
          <mat-card-title
            >#{{ captain.number }} {{ captain.nickname }}</mat-card-title
          >
          <mat-card-subtitle
            >{{ captain.name }} {{ captain.surname }}</mat-card-subtitle
          >
        </mat-card-header>
        <img
          mat-card-image
          src="https://picsum.photos/id/{{ captain.avatar }}/200/300"
          alt="Photo of a Shiba Inu"
        />
        <!-- <mat-card-content> </mat-card-content>
        <mat-card-actions> </mat-card-actions> -->
      </mat-card>
    </ng-template>
  `,
})
export class CaptainCardComponent {
  readonly variantEnum = CardVariantEnum;
  @Input({ required: true }) captain!: TCaptain;
  @Input() hasData = false;
  @Input() variant?: CardVariantEnum;
}
