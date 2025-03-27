import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { timer } from 'rxjs';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-am-chart',
  template: `<div
    style="
  width: 100%;
  height: 500px;
  min-height: 300px;
  display: block;
"
    id="chartdiv"
  ></div>`,
  standalone: true,
})
export class AmChartComponent implements AfterViewInit, OnDestroy {
  private root!: any;

  constructor(private elementRef: ElementRef, private zone: NgZone) {}

  async ngAfterViewInit() {
    timer(2000).subscribe(() => {
      this.zone.runOutsideAngular(async () => {
        const chartDiv =
          this.elementRef.nativeElement.querySelector('#chartdiv');

        if (!chartDiv) {
          console.error('Chart container not found!');
          return;
        }

        let root;

        // Ensure we don't create multiple instances of Root
        if (!root) {
          root = am5.Root.new(chartDiv);
        }

        root.setThemes([am5themes_Animated.new(root)]);

        const chart = root.container.children.push(
          am5xy.XYChart.new(root, {
            panY: false,
            wheelY: 'zoomX',
            layout: root.verticalLayout,
          })
        );

        const data = [
          { category: 'Research', value1: 1000, value2: 588 },
          { category: 'Marketing', value1: 1200, value2: 1800 },
          { category: 'Sales', value1: 850, value2: 1230 },
        ];

        const yAxis = chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {}),
          })
        );

        const xAxis = chart.xAxes.push(
          am5xy.CategoryAxis.new(root, {
            maxDeviation: 0.2,
            renderer: am5xy.AxisRendererX.new(root, {}),
            categoryField: 'category',
          })
        );

        xAxis.data.setAll(data);

        const series1 = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: 'Series 1',
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: 'value1',
            categoryXField: 'category',
            tooltip: am5.Tooltip.new(root, {}),
          })
        );
        series1.data.setAll(data);

        const series2 = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: 'Series 2',
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: 'value2',
            categoryXField: 'category',
          })
        );
        series2.data.setAll(data);

        const legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);

        this.root = root;
      });
    });
  }

  ngOnDestroy() {
    if (this.root) {
      this.root.dispose();
    }
  }
}
