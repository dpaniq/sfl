import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import {
  ChartsService,
  TPlayersAncientRatingSystemTotalPoints,
} from '@entities/charts/charts.service';

import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { take } from 'rxjs';

const CHART_OPTIONS_DEFAULT = {
  chart: {
    type: 'bar',
    events: {
      load: () => {
        console.log('Chart loaded');
      },

      click: (event: Highcharts.ChartClickEventObject) => {
        console.log(
          'Chart clicked at',
          event.xAxis[0].value,
          event.yAxis[0].value,
        );
      },
    },
  },
  title: {
    text: 'Top 10 players of 10 latest seasons',
    align: 'left',
  },
  subtitle: {
    text: 'Choose prepared season',
    // text: 'Source: <a href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population" target="_blank">Wikipedia.org</a>',
    align: 'left',
  },
  xAxis: {
    categories: ['Africa', 'America', 'Asia', 'Europe'],
    title: {
      text: null,
    },
    gridLineWidth: 5,
    lineWidth: 0,
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Points',
      align: 'high',
    },
    labels: {
      overflow: 'justify',
    },
    gridLineWidth: 0,
  },
  tooltip: {
    valueSuffix: ' points',
  },
  plotOptions: {
    bar: {
      borderRadius: 5,
      dataLabels: {
        enabled: true,
      },
      groupPadding: 0.1,
    },
  },
  legend: {
    layout: 'horizontal',
    align: 'right',
    verticalAlign: 'top',
    x: 0,
    y: 12,
    floating: true,
    borderWidth: 0,
    backgroundColor:
      Highcharts.defaultOptions.legend?.backgroundColor || '#FFFFFF',
    shadow: false,
  },
  credits: {
    enabled: true,
  },
  series: [
    {
      visible: true,
      name: 'Season <b>1990</b>',
      data: [632, 727, 3202, null],
    },
    {
      visible: true,
      name: 'Season <b>2000</b>',
      data: [814, 841, 3714, 726],
    },
    {
      visible: false,
      name: 'Season <b>2005</b>',
      data: [1393, 1031, 4695, 745],
    },
  ] as Highcharts.SeriesOptionsType[],
};

@Component({
  selector: 'sfl-total-points-by-player-chart',
  standalone: true,
  imports: [HighchartsChartModule, MatCardModule],
  templateUrl: './total-points-by-player-chart.component.html',
  styleUrl: './total-points-by-player-chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ChartsService],
})
export class TotalPointsByPlayerChartComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private chartsService = inject(ChartsService);

  protected readonly highcharts = Highcharts;
  protected readonly chartOptionsSignal = signal(CHART_OPTIONS_DEFAULT);

  // TODO RENAME THE COMPONENTS/ ENDPOINT / REQUEST NAME

  ngOnInit(): void {
    this.chartsService
      .getPlayersAncientRatingSystemBySeason(2024)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(players => {
        // this.chartOptions.series = data;

        const nicknames = players.map(players => players.nickname);
        const series = this.mapDataToSeries(players);

        this.chartOptionsSignal.set({
          ...CHART_OPTIONS_DEFAULT,
          xAxis: {
            ...CHART_OPTIONS_DEFAULT.xAxis,
            categories: nicknames,
          },
          series,
        });
      });
  }

  public onChartInit(chart: Highcharts.Chart): void {
    // this.chartOptionsSignal.set(chart.options);
  }

  // TODO FIX
  public mapDataToSeries(
    players: TPlayersAncientRatingSystemTotalPoints[],
  ): Highcharts.SeriesOptionsType[] {
    // Extracting the data for each series
    const totalPointsData = players.map(
      player => player.ancientRatingSystem.totalPoints,
    );
    const plusMinusData = players.map(
      player => player.ancientRatingSystem.plusMinus,
    );
    const lastResultData = players.map(
      player => player.ancientRatingSystem.lastResult,
    );

    // Mapping each data series into Highcharts format
    return [
      {
        visible: true,
        name: '+/-: Plus / Minus',
        data: plusMinusData,
      },
      {
        visible: true,
        name: 'LR: last result',
        data: lastResultData,
      },
      {
        visible: true,
        name: 'Total points',
        data: totalPointsData,
      },
    ] as Highcharts.SeriesOptionsType[];
  }
}
