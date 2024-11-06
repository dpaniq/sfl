import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalPointsByPlayerChartComponent } from './total-points-by-player-chart.component';

describe('TotalPointsByPlayerChartComponent', () => {
  let component: TotalPointsByPlayerChartComponent;
  let fixture: ComponentFixture<TotalPointsByPlayerChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalPointsByPlayerChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalPointsByPlayerChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
